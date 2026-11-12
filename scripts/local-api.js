import { mkdir, readFile, writeFile, readdir, unlink, access } from 'node:fs/promises';
import { join } from 'node:path';
import { api } from '../worker/api.js';

export function localApi() {
  return {
    name: 'sentinela-local-api',
    configureServer(server) {
      const root = join(process.cwd(), '.local-data');
      const pathFor = key => join(root, key.split('/').pop());
      const storage = {
        async list() {
          await mkdir(root, { recursive: true });
          return {
            objects: (await readdir(root)).filter(name => /^[a-f0-9-]{36}$/.test(name))
              .map(name => ({ key: `relatos/${name}` })),
            hasMore: false,
            cursor: null
          };
        },
        async get(key) {
          try { return { json: async () => JSON.parse(await readFile(pathFor(key), 'utf8')) }; }
          catch { return null; }
        },
        async head(key) {
          try { await access(pathFor(key)); return true; }
          catch { return false; }
        },
        async put(key, value) {
          await mkdir(root, { recursive: true });
          await writeFile(pathFor(key), value, 'utf8');
        },
        async delete(key) { await unlink(pathFor(key)); }
      };

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const response = await api(new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers: req.headers,
            ...(['POST', 'PUT'].includes(req.method)
              ? { body: Buffer.concat(chunks) }
              : {})
          }), {
            BUCKET: storage,
            // Apenas desenvolvimento local. Nunca usar 'demo-local-2026' na Vercel.
            ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'demo-local-2026'
          });
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          console.error('Falha da API local', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Falha no servidor local.' }));
        }
      });
    }
  };
}
