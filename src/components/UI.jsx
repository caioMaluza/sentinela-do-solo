import {
  X,
  ShieldCheck,
  Mountain,
  LayoutDashboard,
  MessagesSquare,
  Map,
  BookOpen,
  Leaf
} from 'lucide-react';

// ==================================================
// BOTÃO
// ==================================================

export function Button({
  children,
  variant = '',
  ...props
}) {
  return (
    <button
      className={'button ' + variant}
      {...props}
    >
      {children}
    </button>
  );
}

// ==================================================
// BADGE
// ==================================================

export function Badge({
  children,
  tone = 'green'
}) {
  return (
    <span className={'badge ' + tone}>
      {children}
    </span>
  );
}

// ==================================================
// MODAL
// ==================================================

export function Modal({
  title,
  children,
  onClose
}) {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
      >
        <div className="section-heading">
          <h2>{title}</h2>

          <button
            className="icon-btn"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}

// ==================================================
// MENU LATERAL
// ==================================================

export function Sidebar({
  page,
  setPage,
  profile,
  setProfile
}) {
  const nav = [
    ['overview', LayoutDashboard, 'Visão geral'],
    ['reports', MessagesSquare, 'Relatos da comunidade'],
    ['map', Map, 'Mapa da região'],
    ['guide', BookOpen, 'Como se preparar']
  ];

  return (
    <aside className="sidebar">
      <a
        className="brand"
        href="#"
        onClick={() => setPage('overview')}
      >
        <span className="brand-icon">
          <Mountain size={27} />
        </span>

        <span>
          sentinela
          <span className="brand-sub">
            DO SOLO
          </span>
        </span>
      </a>

      <div className="workspace-label">
        ESPAÇO DA COMUNIDADE
      </div>

      <label className="profile-select">
        Seu perfil na demonstração

        <select
          value={profile}
          onChange={e => {
            setProfile(e.target.value);
            setPage('overview');
          }}
        >
          <option>Cidadão</option>
          <option>Defesa Civil</option>
          <option>Empresa</option>
        </select>
      </label>

      <nav>
        {nav.map(([key, Icon, label]) => (
          <button
            key={key}
            className={
              page === key
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => setPage(key)}
          >
            <Icon size={19} />
            {label}

            {page === key && (
              <span className="active-dot" />
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="free-card">
          <Leaf size={24} />

          <strong>
            Cuidar é um esforço coletivo.
          </strong>

          <p>
            Proteção para a comunidade.
            Sempre gratuita para você.
          </p>

          <Badge>
            COMPROMISSO ESG
          </Badge>
        </div>

        <div className="user">
          <span className="avatar">
            C
          </span>

          <div>
            <strong>
              Comunidade Sentinela
            </strong>

            <small>
              Projeto CitizenTech · FIAP
            </small>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ==================================================
// CARTÃO DE MÉTRICAS
// ==================================================

export function MetricCard({
  icon: Icon,
  title,
  value,
  unit,
  foot,
  tone = ''
}) {
  return (
    <div className="metric card">
      <div className="metric-label">
        <span>{title}</span>
        <Icon size={19} />
      </div>

      <div className="metric-value">
        {value}
        <span>{unit}</span>
      </div>

      <small className={tone}>
        {foot}
      </small>
    </div>
  );
}

// ==================================================
// TÍTULO DE SEÇÃO
// ==================================================

export function SectionTitle({
  eyebrow,
  title,
  children
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && (
          <p className="eyebrow">
            {eyebrow}
          </p>
        )}

        <h2>{title}</h2>
      </div>

      {children}
    </div>
  );
}

// ==================================================
// ESTADO VAZIO
// ==================================================

export function EmptyState({ children }) {
  return (
    <div className="empty">
      <MessagesSquare />

      <h3>
        Nenhum relato por aqui
      </h3>

      <p>{children}</p>
    </div>
  );
}

// ==================================================
// RODAPÉ
// ==================================================

export function Footer() {
  return (
    <footer>
      <span>
        <ShieldCheck size={15} />
        Tecnologia a serviço da vida.
      </span>

      <span>
        Sentinela do Solo © 2026 · ODS 11 & 13
      </span>
    </footer>
  );
}
