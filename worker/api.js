// API compartilhada entre o Vite local e as Functions da Vercel.
// Os indicadores são fictícios; esta API NÃO substitui a Defesa Civil.
import { clusters } from '../src/data/clusters.js';

const TYPES = ['Rachadura', 'Mina d’água', 'Inclinação de árvore', 'Movimentação de terra', 'Outro'];
const STATUSES = ['Recebido', 'Em Vistoria', 'Confirmado', 'Descartado'];
const REGIONS = new Set(clusters.map(region => region.id));
const BODY_LIMIT = 2_200_000;
const PHOTO_PATTERN = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
const PATH_PATTERN = /^\/api\/relatos(?:\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))?\/?$/i;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

function validate(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return false;
  return (
    TYPES.includes(record.type) &&
    REGIONS.has(record.clusterId) &&
    STATUSES.includes(record.status) &&
    typeof record.description === 'string' &&
    record.description.trim().length >= 10 &&
    record.description.length <= 2000 &&
    typeof record.address === 'string' &&
    record.address.trim().length >= 1 &&
    record.address.length <= 180 &&
    (record.photo === undefined || record.photo === '' ||
      (typeof record.photo === 'string' && PHOTO_PATTERN.test(record.photo)))
  );
}

function isAdmin(request, env) {
  // Nunca envie esta chave para VITE_* ou para código frontend.
  return typeof env.ADMIN_API_KEY === 'string' &&
    env.ADMIN_API_KEY.length >= 12 &&
    request.headers.get('x-admin-key') === env.ADMIN_API_KEY;
}

async function readRecords(storage) {
  let cursor;
  const keys = [];

  // A SDK pagina os arquivos: apenas ler a primeira página perde relatos.
  for (let page = 0; page < 20; page++) {
    const batch = await storage.list({ prefix: 'relatos/', limit: 100, cursor });
    keys.push(...batch.objects.map(entry => entry.key));
    if (!batch.hasMore || !batch.cursor) break;
    cursor = batch.cursor;
  }

  const found = [];
  // Evitar centenas de downloads simultâneos contra o Blob.
  for (let i = 0; i < keys.length; i += 15) {
    const chunk = await Promise.all(keys.slice(i, i + 15).map(async key => {
      try {
        const obj = await storage.get(key);
        return obj ? await obj.json() : null;
      } catch {
        return null;
      }
    }));
    found.push(...chunk.filter(value => value && typeof value === 'object'));
  }

  return found.sort((a, b) =>
    String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
  ).slice(0, 150); // Limite de exibição de um protótipo pequeno.
}

export async function api(request, env = {}) {
  const path = new URL(request.url).pathname;
  const match = path.match(PATH_PATTERN);
  if (!match) return json({ error: 'Recurso não encontrado.' }, 404);

  const id = match[1];
  const key = id ? `relatos/${id}` : null;
  const storage = env.BUCKET;
  if (!storage) return json({ error: 'Armazenamento não configurado.' }, 503);

  try {
    if (request.method === 'GET' && !id) {
      return json(await readRecords(storage));
    }

    if ((request.method === 'PUT' && id) || (request.method === 'DELETE' && id)) {
      if (typeof env.ADMIN_API_KEY !== 'string' || env.ADMIN_API_KEY.length < 12) {
        return json({ error: 'ADMIN_API_KEY não configurada no servidor.' }, 503);
      }
      if (!isAdmin(request, env)) {
        return json({ error: 'Acesso negado. Confira a chave da triagem.' }, 403);
      }
    }

    if (request.method === 'DELETE' && id) {
      if (!(await storage.head(key))) return json({ error: 'Relato não encontrado.' }, 404);
      await storage.delete(key);
      return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
    }

    if ((request.method === 'POST' && !id) || (request.method === 'PUT' && id)) {
      const contentType = request.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        return json({ error: 'Envie os dados em JSON.' }, 415);
      }

      const declaredSize = Number(request.headers.get('content-length') || 0);
      if (declaredSize > BODY_LIMIT) return json({ error: 'Imagem ou relato grande demais.' }, 413);

      const raw = await request.text();
      if (new TextEncoder().encode(raw).byteLength > BODY_LIMIT) {
        return json({ error: 'Imagem ou relato grande demais.' }, 413);
      }

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return json({ error: 'JSON inválido.' }, 400);
      }

      // Visitantes podem criar relatos, mas jamais escolher seu status de triagem.
      if (!id && data && typeof data === 'object' && !Array.isArray(data)) {
        data.status = 'Recebido';
      }
      if (!validate(data)) {
        return json({ error: 'Confira os campos, a foto e os limites do relato.' }, 400);
      }

      let previous = null;
      if (id) {
        const obj = await storage.get(key);
        if (!obj) return json({ error: 'Relato não encontrado.' }, 404);
        previous = await obj.json();
      }

      const now = new Date().toISOString();
      const record = {
        id: id || crypto.randomUUID(),
        type: data.type,
        description: data.description.trim(),
        address: data.address.trim(),
        clusterId: data.clusterId,
        status: data.status,
        photo: data.photo || '',
        createdAt: previous?.createdAt || now,
        updatedAt: now
      };

      await storage.put(`relatos/${record.id}`, JSON.stringify(record));
      return json(record, id ? 200 : 201);
    }

    return json({ error: 'Método não permitido.' }, 405);
  } catch (error) {
    console.error('Falha na API de relatos:', error);
    return json({ error: 'Falha no armazenamento. Verifique a conexão Blob nos logs da Vercel.' }, 503);
  }
}
