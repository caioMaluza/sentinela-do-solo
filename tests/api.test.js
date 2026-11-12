import test from 'node:test';
import assert from 'node:assert/strict';

import { api } from '../worker/api.js';

// ==================================================
// TESTE DE CRUD E VALIDAÇÃO
// ==================================================

test('CRUD persistente e validacao', async () => {
  const records = new Map();

  // Armazenamento simulado
  const env = {
    BUCKET: {
      list: async () => ({
        objects: [...records.keys()].map(key => ({
          key
        }))
      }),

      get: async key =>
        records.has(key)
          ? {
              json: async () =>
                JSON.parse(records.get(key))
            }
          : null,

      head: async key => records.has(key),

      put: async (key, value) =>
        records.set(key, value),

      delete: async key =>
        records.delete(key)
    }
  };

  // Função auxiliar de requisição
  const call = (
    path,
    method = 'GET',
    data
  ) =>
    api(
      new Request(
        'https://example.test/api/relatos' + path,
        {
          method,
          ...(data
            ? { body: JSON.stringify(data) }
            : {})
        }
      ),
      env
    );

  // Validar envio incorreto
  assert.equal(
    (await call('', 'POST', {})).status,
    400
  );

  // Criar relato
  const response = await call('', 'POST', {
    type: 'Rachadura',
    description: 'Rachadura observada no muro',
    address: 'Rua de teste',
    clusterId: 'brasilandia',
    status: 'Recebido'
  });

  assert.equal(response.status, 201);

  const created = await response.json();

  // Verificar criação
  assert.equal(
    (await (await call('')).json()).length,
    1
  );

  // Atualizar relato
  assert.equal(
    (
      await call(
        '/' + created.id,
        'PUT',
        {
          ...created,
          status: 'Em Vistoria'
        }
      )
    ).status,
    200
  );

  // Verificar atualização
  assert.equal(
    (await (await call('')).json())[0].status,
    'Em Vistoria'
  );

  // Excluir relato
  assert.equal(
    (
      await call(
        '/' + created.id,
        'DELETE'
      )
    ).status,
    204
  );

  // Verificar exclusão
  assert.equal(
    (await (await call('')).json()).length,
    0
  );
});
