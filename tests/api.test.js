import test from 'node:test';
import assert from 'node:assert/strict';
import { api } from '../worker/api.js';

const ADMIN_KEY = 'test-private-access-456';

function makeFixture() {
  const files = new Map();
  return {
    files,
    env: {
      ADMIN_API_KEY: ADMIN_KEY,
      BUCKET: {
        async list({ limit = 100, cursor } = {}) {
          const sorted = [...files.keys()].sort();
          const start = cursor ? Number(cursor) : 0;
          const page = sorted.slice(start, start + limit);
          const next = start + page.length;
          return {
            objects: page.map(key => ({ key })),
            cursor: next < sorted.length ? String(next) : null,
            hasMore: next < sorted.length
          };
        },
        async get(key) {
          return files.has(key)
            ? { json: async () => JSON.parse(files.get(key)) }
            : null;
        },
        async head(key) { return files.has(key); },
        async put(key, value) { files.set(key, value); },
        async delete(key) { files.delete(key); }
      }
    }
  };
}

const valid = {
  type: 'Rachadura', description: 'Rachadura fictícia observada no muro',
  address: 'Rua Exemplo, 20', clusterId: 'brasilandia', status: 'Recebido', photo: ''
};

function call(env, path = '', method = 'GET', data, adminKey) {
  return api(new Request(`https://example.test/api/relatos${path}`, {
    method,
    headers: {
      ...(data !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(adminKey ? { 'x-admin-key': adminKey } : {})
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {})
  }), env);
}

test('criar, listar e validar relato', async () => {
  const { env } = makeFixture();
  assert.equal((await call(env, '', 'POST', {})).status, 400);
  assert.equal((await call(env, '', 'POST', { ...valid, photo: 'data:image/svg+xml;base64,WA==' })).status, 400);
  const createdResponse = await call(env, '', 'POST', { ...valid, status: 'Confirmado' });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.equal(created.status, 'Recebido', 'visitantes não definem status');
  assert.equal((await (await call(env)).json()).length, 1);
});

test('nenhuma edição ou exclusão sem chave administrativa', async () => {
  const { env } = makeFixture();
  const record = await (await call(env, '', 'POST', valid)).json();
  assert.equal((await call(env, `/${record.id}`, 'PUT', { ...record, status: 'Confirmado' })).status, 403);
  assert.equal((await call(env, `/${record.id}`, 'DELETE')).status, 403);
  assert.equal((await call(env, `/${record.id}`, 'DELETE', undefined, 'incorreta')).status, 403);
  assert.equal((await (await call(env)).json())[0].status, 'Recebido');
});

test('administrador atualiza e exclui', async () => {
  const { env } = makeFixture();
  const record = await (await call(env, '', 'POST', valid)).json();
  const updated = await call(env, `/${record.id}`, 'PUT', { ...record, status: 'Em Vistoria' }, ADMIN_KEY);
  assert.equal(updated.status, 200);
  assert.equal((await updated.json()).status, 'Em Vistoria');
  assert.equal((await call(env, `/${record.id}`, 'DELETE', undefined, ADMIN_KEY)).status, 204);
  assert.deepEqual(await (await call(env)).json(), []);
  assert.equal((await call(env, `/${record.id}`, 'DELETE', undefined, ADMIN_KEY)).status, 404);
});

test('ausência de chave do servidor bloqueia alterações', async () => {
  const { env } = makeFixture();
  delete env.ADMIN_API_KEY;
  const id = 'aaaa0000-bbbb-4ccc-8ddd-eeeeeeeeeeee';
  assert.equal((await call(env, `/${id}`, 'DELETE', undefined, ADMIN_KEY)).status, 503);
});

test('resposta de listagem é ordenada por data; paginação não perde registros', async () => {
  const { env, files } = makeFixture();
  const now = new Date().toISOString();
  for (let i = 0; i < 105; i++) {
    const id = `${String(i).padStart(8, '0')}-bbbb-4ccc-8ddd-eeeeeeeeeeee`;
    files.set(`relatos/${id}`, JSON.stringify({ ...valid, id, createdAt: now }));
  }
  const response = await call(env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).length, 105);
});

test('rota inválida e método proibido retornam erros específicos', async () => {
  const { env } = makeFixture();
  assert.equal((await call(env, '/xyz')).status, 404);
  assert.equal((await call(env, '', 'DELETE')).status, 405);
});
