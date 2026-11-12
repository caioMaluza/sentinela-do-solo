const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export async function request(path, options = {}) {
  const { adminKey, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(baseUrl + path, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(adminKey ? { 'x-admin-key': adminKey } : {}),
        ...fetchOptions.headers
      }
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : null;

    if (!response.ok) {
      throw new Error(payload?.error || `Erro HTTP ${response.status} na API.`);
    }
    if (response.status === 204) return null;
    if (!payload) throw new Error('A API retornou uma resposta inesperada. Verifique as rotas da Vercel.');
    return payload;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('A requisição demorou demais. Tente novamente.');
    }
    if (error instanceof TypeError) {
      throw new Error('Falha de conexão com a API. Verifique sua internet e o deploy.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const reportsApi = {
  list: () => request('/relatos'),
  create: data => request('/relatos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data, adminKey) => request(`/relatos/${encodeURIComponent(id)}`, {
    method: 'PUT', body: JSON.stringify(data), adminKey
  }),
  remove: (id, adminKey) => request(`/relatos/${encodeURIComponent(id)}`, {
    method: 'DELETE', adminKey
  })
};
