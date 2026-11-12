import {
  readFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  writeFileSync
} from 'node:fs';

const assets = {};

// ==================================================
// PERCORRER OS ARQUIVOS DO BUILD
// ==================================================

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = dir + '/' + name;

    if (statSync(path).isDirectory()) {
      walk(path);
    } else {
      const ext = name.split('.').pop();

      assets['/' + path.slice(5)] = {
        body: readFileSync(path).toString('base64'),

        type: ({
          html: 'text/html; charset=utf-8',
          js: 'application/javascript',
          css: 'text/css',
          png: 'image/png',
          svg: 'image/svg+xml'
        })[ext] || 'application/octet-stream'
      };
    }
  }
}

// ==================================================
// CARREGAR ARQUIVOS
// ==================================================

walk('dist');

const api = readFileSync(
  'worker/api.js',
  'utf8'
).replace(
  'export async function api',
  'async function api'
);

// ==================================================
// CRIAR SERVIDOR
// ==================================================

mkdirSync('dist/server', {
  recursive: true
});

writeFileSync(
  'dist/server/index.js',

  api +
  '\nconst assets=' +
  JSON.stringify(assets) +

  `;export default {
    async fetch(request, env) {
      const pathname = new URL(request.url).pathname;

      if (pathname.startsWith('/api/')) {
        return api(request, env);
      }

      const asset =
        assets[pathname] ||
        assets['/index.html'];

      return new Response(
        Uint8Array.from(
          atob(asset.body),
          c => c.charCodeAt(0)
        ),
        {
          headers: {
            'Content-Type': asset.type,
            'X-Content-Type-Options': 'nosniff'
          }
        }
      );
    }
  };`
);
