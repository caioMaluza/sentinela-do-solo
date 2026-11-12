import {
  list,
  get,
  put,
  del
} from '@vercel/blob';

import { api } from '../worker/api.js';

const storage = {
  async list({ prefix, limit } = {}) {
    const result = await list({ prefix, limit });

    return {
      objects: result.blobs.map(blob => ({
        key: blob.pathname
      }))
    };
  },

  async get(key) {
    const result = await get(key, {
      access: 'private'
    });

    if (!result || result.statusCode !== 200) {
      return null;
    }

    return {
      json: () => new Response(result.stream).json()
    };
  },

  async head(key) {
    return Boolean(
      await get(key, { access: 'private' })
    );
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
  async fetch(request) {
    return api(request, {
      BUCKET: storage
    });
  }
};
