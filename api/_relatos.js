import { list, get, head, put, del } from '@vercel/blob';
import { api } from '../worker/api.js';

// Conecte um Vercel Blob *Private* ao projeto.
// O token é utilizado exclusivamente no servidor, nunca no navegador.
const storage = {
  async list({ prefix = 'relatos/', limit = 100, cursor } = {}) {
    const result = await list({ prefix, limit, ...(cursor ? { cursor } : {}) });
    return {
      objects: result.blobs.map(blob => ({ key: blob.pathname })),
      cursor: result.cursor,
      hasMore: result.hasMore
    };
  },

  async get(key) {
    const result = await get(key, { access: 'private' });
    if (!result || result.statusCode !== 200) return null;
    return { json: async () => new Response(result.stream).json() };
  },

  async head(key) {
    return Boolean(await head(key));
  },

  async put(key, value) {
    await put(key, value, {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60
    });
  },

  async delete(key) {
    await del(key);
  }
};

export default {
  fetch(request) {
    return api(request, {
      BUCKET: storage,
      ADMIN_API_KEY: process.env.ADMIN_API_KEY
    });
  }
};
