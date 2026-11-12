import {
  mkdir,
  readFile,
  writeFile,
  readdir,
  unlink,
  access
} from 'node:fs/promises';

import { api } from '../worker/api.js';

export function localApi() {
  return {
    name: 'sentinela-local-api',

    configureServer(server) {
      const root = '.local-data';

      // ============================================
      // ARMAZENAMENTO LOCAL
      // ============================================

      const env = {
        BUCKET: {
          list: async () => {
            await mkdir(root, {
              recursive: true
            });

            return {
              objects: (await readdir(root)).map(name => ({
                key: 'relatos/' + name
              }))
            };
          },

          get: async key => {
            try {
              const value = await readFile(
                root + '/' + key.split('/').pop(),
                'utf8'
              );

              return {
                json: async () => JSON.parse(value)
              };
            } catch {
              return null;
            }
          },

          head: async key => {
            try {
              await access(
                root + '/' + key.split('/').pop()
              );

              return true;
            } catch {
              return false;
            }
          },

          put: async (key, value) => {
            await mkdir(root, {
              recursive: true
            });

            await writeFile(
              root + '/' + key.split('/').pop(),
              value
            );
          },

          delete: async key => {
            await unlink(
              root + '/' + key.split('/').pop()
            );
          }
        }
      };

      // ============================================
      // MIDDLEWARE DA API
      // ============================================

      server.middlewares.use(
        async (req, res, next) => {
          if (!req.url.startsWith('/api/')) {
            return next();
          }

          const chunks = [];

          for await (const chunk of req) {
            chunks.push(chunk);
          }

          const response = await api(
            new Request(
              'http://localhost' + req.url,
              {
                method: req.method,
                headers: req.headers,

                ...(
                  ['POST', 'PUT'].includes(req.method)
                    ? { body: Buffer.concat(chunks) }
                    : {}
                )
              }
            ),
            env
          );

          res.statusCode = response.status;

          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });

          res.end(
            Buffer.from(
              await response.arrayBuffer()
            )
          );
        }
      );
    }
  };
}
