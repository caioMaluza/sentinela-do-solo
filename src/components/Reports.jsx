import { useState } from 'react';

import {
  Camera,
  Plus,
  Pencil,
  Trash2,
  MapPin
} from 'lucide-react';

import {
  Modal,
  Button,
  Badge,
  EmptyState,
  SectionTitle
} from './UI';

// ==================================================
// FORMULÁRIO DE RELATOS
// ==================================================

export function ReportForm({
  initial,
  cluster,
  onSave,
  onClose,
  busy
}) {
  const [data, setData] = useState(
    initial || {
      type: 'Rachadura',
      description: '',
      address: '',
      clusterId: cluster.id,
      photo: '',
      status: 'Recebido'
    }
  );

  const [error, setError] = useState('');

  const change = (key, value) => {
    setData({
      ...data,
      [key]: value
    });
  };

  async function photo(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (
      !file.type.startsWith('image/') ||
      file.size > 1500000
    ) {
      setError('Escolha uma imagem de até 1,5 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      change('photo', reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (await onSave(data, initial?.id)) {
      onClose();
    }
  }

  return (
    <Modal
      title={initial ? 'Editar relato' : 'O que você observou?'}
      onClose={onClose}
    >
      <p className="muted mb-5">
        Seu olhar ajuda a cuidar da comunidade.
        Use dados fictícios nesta demonstração.
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Tipo de ocorrência

          <select
            value={data.type}
            onChange={e => change('type', e.target.value)}
          >
            {[
              'Rachadura',
              'Mina d’água',
              'Inclinação de árvore',
              'Movimentação de terra',
              'Outro'
            ].map(x => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>

        <label>
          Local da observação

          <input
            required
            maxLength={180}
            value={data.address}
            onChange={e => change('address', e.target.value)}
            placeholder="Ex.: Rua das Flores, próximo ao número 20"
          />
        </label>

        <label>
          Descreva o que mudou

          <textarea
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            value={data.description}
            onChange={e => change('description', e.target.value)}
            placeholder="Conte o que você percebeu e há quanto tempo…"
          />
        </label>

        <label className="photo-upload">
          <Camera size={22} />
          Adicionar foto ou usar a câmera

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={photo}
          />
        </label>

        {data.photo && (
          <img
            className="photo-preview"
            src={data.photo}
            alt="Foto anexada ao relato"
          />
        )}

        {error && (
          <p className="error">{error}</p>
        )}

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button disabled={busy}>
            {busy ? 'Salvando…' : 'Salvar relato'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ==================================================
// LISTAGEM E TRIAGEM DE RELATOS
// ==================================================

export function ReportList({
  api,
  cluster,
  triage = false,
  compact = false,
  onNew
}) {
  const [edit, setEdit] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState('');

  const reports = api.reports.filter(
    x =>
      x.clusterId === cluster.id &&
      (
        x.description + ' ' +
        x.address + ' ' +
        x.type
      )
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  return (
    <section className="card reports">
      <SectionTitle
        title={triage ? 'Fila de triagem' : 'Relatos da comunidade'}
      >
        <button
          className="text-button"
          onClick={onNew}
        >
          <Plus size={16} />
          Novo relato
        </button>
      </SectionTitle>

      {!compact && (
        <input
          className="search"
          aria-label="Buscar relatos"
          placeholder="Buscar por descrição, local ou tipo…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      )}

      <p className="muted text-xs mb-4">
        Espaço compartilhado de demonstração.
        Não insira dados pessoais.
      </p>

      {api.error && (
        <div className="error">
          {api.error}

          <button onClick={api.refresh}>
            Tentar novamente
          </button>
        </div>
      )}

      {api.loading ? (
        <p className="muted py-8">
          Carregando relatos…
        </p>
      ) : reports.length === 0 ? (
        <EmptyState>
          Percebeu algo diferente?
          Compartilhe sua observação.
        </EmptyState>
      ) : (
        (compact ? reports.slice(0, 3) : reports).map(r => (
          <article className="report-row" key={r.id}>
            <span className="report-symbol">
              <MapPin size={20} />
            </span>

            <div className="report-content">
              <strong>{r.type}</strong>

              <p>{r.address}</p>

              <p className="report-description">
                {r.description}
              </p>

              <small>
                {new Date(r.createdAt).toLocaleDateString('pt-BR')}
              </small>

              {r.photo && (
                <img
                  className="photo-preview"
                  src={r.photo}
                  alt="Registro da ocorrência"
                />
              )}
            </div>

            <div className="report-actions">
              <Badge tone="neutral">
                {r.status}
              </Badge>

              {triage && (
                <select
                  aria-label="Status da triagem"
                  disabled={api.busy}
                  value={r.status}
                  onChange={e =>
                    api.save(
                      { ...r, status: e.target.value },
                      r.id
                    )
                  }
                >
                  {[
                    'Recebido',
                    'Em Vistoria',
                    'Confirmado',
                    'Descartado'
                  ].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              )}

              <div className="flex gap-2">
                <button
                  className="icon-btn"
                  aria-label="Editar relato"
                  onClick={() => setEdit(r)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  className="icon-btn"
                  aria-label="Excluir relato"
                  onClick={() => setDeleting(r)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))
      )}

      {edit && (
        <ReportForm
          initial={edit}
          cluster={cluster}
          onSave={api.save}
          onClose={() => setEdit(null)}
          busy={api.busy}
        />
      )}

      {deleting && (
        <Modal
          title="Excluir este relato?"
          onClose={() => setDeleting(null)}
        >
          <p className="muted my-5">
            O registro será removido permanentemente
            da demonstração.
          </p>

          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={() => setDeleting(null)}
            >
              Cancelar
            </Button>

            <Button
              disabled={api.busy}
              variant="danger"
              onClick={async () => {
                if (await api.remove(deleting.id)) {
                  setDeleting(null);
                }
              }}
            >
              Excluir relato
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
