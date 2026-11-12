import { useState } from 'react';
import { Camera, Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { Modal, Button, Badge, EmptyState, SectionTitle } from './UI';

const TYPES = ['Rachadura', 'Mina d’água', 'Inclinação de árvore', 'Movimentação de terra', 'Outro'];
const STATUSES = ['Recebido', 'Em Vistoria', 'Confirmado', 'Descartado'];

async function compressImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Use uma foto JPG, PNG ou WebP.');
  }
  if (file.size > 8_000_000) throw new Error('A imagem original deve ter até 8 MB.');

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Não foi possível processar a foto neste aparelho.');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const result = canvas.toDataURL('image/webp', 0.7);
    if (!result.startsWith('data:image/webp;')) {
      throw new Error('Este navegador não suporta compactação WebP.');
    }
    if (result.length > 900_000) {
      throw new Error('A foto ficou grande demais. Experimente outra imagem.');
    }
    return result;
  } finally {
    bitmap.close?.();
  }
}

export function ReportForm({ initial, cluster, onSave, onClose, busy, apiError = '' }) {
  const [data, setData] = useState(() => initial ? { ...initial } : {
    type: 'Rachadura', description: '', address: '', clusterId: cluster.id,
    photo: '', status: 'Recebido'
  });
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const change = (key, value) => setData(previous => ({ ...previous, [key]: value }));

  async function selectPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setProcessing(true);
    try {
      change('photo', await compressImage(file));
    } catch (exception) {
      setError(exception.message);
    } finally {
      setProcessing(false);
      event.target.value = '';
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (processing || busy) return;
    if (await onSave(data, initial?.id)) onClose();
  }

  return (
    <Modal title={initial ? 'Editar relato' : 'O que você observou?'} onClose={onClose}>
      <p className="muted mb-5">
        Este é um ambiente público de demonstração. Use endereços fictícios e não
        inclua nomes, telefones, documentos ou fotos que identifiquem pessoas.
      </p>
      <form onSubmit={submit}>
        <label>
          Tipo de ocorrência
          <select value={data.type} onChange={e => change('type', e.target.value)}>
            {TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label>
          Local da observação (fictício)
          <input required maxLength={180} value={data.address}
            onChange={e => change('address', e.target.value)}
            placeholder="Ex.: Rua Exemplo, próximo ao número 20" />
        </label>
        <label>
          Descreva o que mudou
          <textarea required minLength={10} maxLength={2000} rows={4}
            value={data.description} onChange={e => change('description', e.target.value)}
            placeholder="Conte o que você percebeu e há quanto tempo…" />
        </label>
        <label className="photo-upload">
          <Camera size={22} /> Anexar foto JPG, PNG ou WebP (opcional)
          <input type="file" accept="image/jpeg,image/png,image/webp"
            capture="environment" onChange={selectPhoto} disabled={processing} />
        </label>
        {processing && <p className="muted" role="status">Otimizando imagem…</p>}
        {data.photo && (
          <div>
            <img className="photo-preview" src={data.photo} alt="Prévia da foto anexada" />
            <button className="text-button" type="button" onClick={() => change('photo', '')}>
              Remover foto
            </button>
          </div>
        )}
        {(error || apiError) && <p className="error" role="alert">{error || apiError}</p>}
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={busy || processing}>
            {busy ? 'Salvando…' : processing ? 'Processando…' : 'Salvar relato'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function ReportList({ api, cluster, triage = false, compact = false, onNew }) {
  const [edit, setEdit] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState('');
  const canManage = triage && Boolean(api.adminKey);
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
  const reports = api.reports.filter(record =>
    record.clusterId === cluster.id &&
    [record.description, record.address, record.type].join(' ')
      .toLocaleLowerCase('pt-BR').includes(normalizedQuery)
  );

  return (
    <section className="card reports">
      <SectionTitle title={triage ? 'Fila de triagem (simulada)' : 'Relatos da comunidade'}>
        <button type="button" className="text-button" onClick={onNew}>
          <Plus size={16} /> Novo relato
        </button>
      </SectionTitle>

      {!compact && <input className="search" aria-label="Buscar relatos"
        placeholder="Buscar por descrição, local ou tipo…"
        value={query} onChange={e => setQuery(e.target.value)} />}

      <p className="muted text-xs mb-4">
        Relatos compartilhados entre visitantes desta demonstração. Não insira dados pessoais.
        {triage && !canManage && ' Para alterar a triagem, informe a chave no painel da Defesa Civil.'}
      </p>

      {api.error && (
        <div className="error" role="alert">
          {api.error} <button type="button" onClick={() => void api.refresh()}>Tentar novamente</button>
        </div>
      )}

      {api.loading ? (
        <p className="muted py-8" role="status">Carregando relatos…</p>
      ) : reports.length === 0 ? (
        <EmptyState>
          {normalizedQuery ? 'Nenhum resultado para esta busca.' : 'Compartilhe uma observação fictícia.'}
        </EmptyState>
      ) : (
        (compact ? reports.slice(0, 3) : reports).map(record => (
          <article className="report-row" key={record.id}>
            <span className="report-symbol"><MapPin size={20} /></span>
            <div className="report-content">
              <strong>{record.type}</strong>
              <p>{record.address}</p>
              <p className="report-description">{record.description}</p>
              <small>{new Date(record.createdAt).toLocaleDateString('pt-BR')}</small>
              {record.photo && <img loading="lazy" className="photo-preview"
                src={record.photo} alt="Foto de uma ocorrência fictícia" />}
            </div>
            <div className="report-actions">
              <Badge tone="neutral">{record.status}</Badge>
              {canManage && (
                <>
                  <select aria-label={`Status da triagem: ${record.type}`}
                    disabled={api.busy} value={record.status}
                    onChange={e => void api.save({ ...record, status: e.target.value }, record.id)}>
                    {STATUSES.map(status => <option key={status}>{status}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <button type="button" className="icon-btn" title="Editar relato"
                      aria-label="Editar relato" disabled={api.busy} onClick={() => setEdit(record)}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="icon-btn" title="Excluir relato"
                      aria-label="Excluir relato" disabled={api.busy} onClick={() => setDeleting(record)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </article>
        ))
      )}

      {edit && <ReportForm initial={edit} cluster={cluster} onSave={api.save}
        onClose={() => setEdit(null)} busy={api.busy} apiError={api.error} />}

      {deleting && (
        <Modal title="Excluir este relato?" onClose={() => setDeleting(null)}>
          <p className="muted my-5">A exclusão removerá permanentemente o registro da demonstração.</p>
          {api.error && <p className="error" role="alert">{api.error}</p>}
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
            <Button type="button" disabled={api.busy} variant="danger" onClick={async () => {
              if (await api.remove(deleting.id)) setDeleting(null);
            }}>Excluir relato</Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
