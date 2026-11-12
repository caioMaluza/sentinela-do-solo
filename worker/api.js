
// ==================================================
// RESPOSTA JSON
// ==================================================

const json = (value, status = 200) =>
  new Response(
    JSON.stringify(value),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    }
  );

// ==================================================
// API PRINCIPAL
// ==================================================

export async function api(request, env) {
  const url = new URL(request.url);

  const match = url.pathname.match(
    /^\/api\/relatos(?:\/([a-f0-9-]{36}))?$/
  );

  if (!match) {
    return json(
      { error: 'Recurso não encontrado' },
      404
    );
  }

  if (!env.BUCKET) {
    return json(
      { error: 'O armazenamento não está disponível.' },
      503
    );
  }

  const id = match[1];
  const key = id ? 'relatos/' + id : null;

  try {
    // ==============================================
    // GET - LISTAR RELATOS
    // ==============================================

    if (request.method === 'GET' && !id) {
      const list = await env.BUCKET.list({
        prefix: 'relatos/',
        limit: 1000
      });

      const records = await Promise.all(
        list.objects.map(async x => {
          const obj = await env.BUCKET.get(x.key);

          return obj ? obj.json() : null;
        })
      );

      return json(
        records
          .filter(Boolean)
          .sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
          )
      );
    }

    // ==============================================
    // DELETE - EXCLUIR RELATO
    // ==============================================

    if (request.method === 'DELETE' && id) {
      if (!(await env.BUCKET.head(key))) {
        return json(
          { error: 'Relato não encontrado' },
          404
        );
      }

      await env.BUCKET.delete(key);

      return new Response(null, {
        status: 204
      });
    }

    // ==============================================
    // POST E PUT - CRIAR OU ATUALIZAR
    // ==============================================

    if (
      (request.method === 'POST' && !id) ||
      (request.method === 'PUT' && id)
    ) {
      // Verificar tamanho da requisição
      if (
        Number(request.headers.get('content-length')) >
        2200000
      ) {
        return json(
          { error: 'Imagem muito grande' },
          413
        );
      }

      const text = await request.text();

      if (text.length > 2200000) {
        return json(
          { error: 'Imagem muito grande' },
          413
        );
      }

      // Converter JSON
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        return json(
          { error: 'JSON inválido' },
          400
        );
      }

      // ============================================
      // VALIDAR CAMPOS
      // ============================================

      if (
        typeof data.description !== 'string' ||
        data.description.trim().length < 10 ||
        data.description.length > 2000 ||

        typeof data.address !== 'string' ||
        !data.address.trim() ||
        data.address.length > 180 ||

        ![
          'brasilandia',
          'jaragua',
          'mboi'
        ].includes(data.clusterId) ||

        ![
          'Rachadura',
          'Mina d’água',
          'Inclinação de árvore',
          'Movimentação de terra',
          'Outro'
        ].includes(data.type) ||

        ![
          'Recebido',
          'Em Vistoria',
          'Confirmado',
          'Descartado'
        ].includes(data.status)
      ) {
        return json(
          {
            error: 'Confira os campos obrigatórios do relato.'
          },
          400
        );
      }

      // ============================================
      // VALIDAR IMAGEM
      // ============================================

      if (
        data.photo &&
        !/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(
          data.photo
        )
      ) {
        return json(
          {
            error: 'Formato de imagem não permitido. Use JPG, PNG ou WebP.'
          },
          400
        );
      }

      // ============================================
      // RECUPERAR REGISTRO ANTERIOR
      // ============================================

      let old = null;

      if (id) {
        const obj = await env.BUCKET.get(key);

        if (!obj) {
          return json(
            { error: 'Relato não encontrado' },
            404
          );
        }

        old = await obj.json();
      }

      // ============================================
      // CRIAR OBJETO DO RELATO
      // ============================================

      const record = {
        id: id || crypto.randomUUID(),
        type: data.type,
        description: data.description.trim(),
        address: data.address.trim(),
        clusterId: data.clusterId,
        status: data.status,
        photo: data.photo || '',
        createdAt:
          old?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // ============================================
      // SALVAR NO ARMAZENAMENTO
      // ============================================

      await env.BUCKET.put(
        'relatos/' + record.id,
        JSON.stringify(record),
        {
          httpMetadata: {
            contentType: 'application/json'
          }
        }
      );

      return json(
        record,
        id ? 200 : 201
      );
    }

    // ==============================================
    // MÉTODO NÃO PERMITIDO
    // ==============================================

    return json(
      { error: 'Método não permitido' },
      405
    );

  } catch {
    return json(
      {
        error: 'Não foi possível acessar os relatos. Tente novamente.'
      },
      500
    );
  }
}
