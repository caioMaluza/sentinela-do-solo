import { useEffect, useRef } from 'react';

import {
  X,
  Mountain,
  LayoutDashboard,
  MessagesSquare,
  Map,
  BookOpen,
  LogOut,
  ShieldCheck,
  TrainFront,
  UserRound
} from 'lucide-react';

export function Button({
  children,
  variant = '',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`button ${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'green' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function Modal({ title, children, onClose }) {
  const closeRef = useRef(onClose);
  const dialogRef = useRef(null);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    dialogRef.current
      ?.querySelector('button, input, select, textarea, a[href]')
      ?.focus();

    function handleKey(event) {
      if (event.key === 'Escape') {
        closeRef.current();
      }

      if (event.key !== 'Tab') return;

      const items = [
        ...(dialogRef.current?.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]'
        ) || [])
      ];

      const first = items[0];
      const last = items.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={event => event.stopPropagation()}
      >
        <div className="section-heading">
          <h2>{title}</h2>

          <button
            type="button"
            className="icon-btn"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}

export function Sidebar({
  page,
  setPage,
  account,
  onLogout
}) {
  const citizen = account.role === 'citizen';
  const civil = account.role === 'civil';

  const Icon = citizen
    ? UserRound
    : civil
      ? ShieldCheck
      : TrainFront;

  const nav = [
    [
      'overview',
      LayoutDashboard,
      citizen ? 'Minha comunidade' : 'Dashboard'
    ],
    [
      'map',
      Map,
      citizen ? 'Mapa da região' : 'Mapa de monitoramento'
    ],

    ...(account.role !== 'company'
      ? [[
          'reports',
          MessagesSquare,
          civil ? 'Triagem de relatos' : 'Relatos da comunidade'
        ]]
      : []),

    ...(citizen
      ? [['guide', BookOpen, 'Como se preparar']]
      : [])
  ];

  return (
    <aside className="sidebar">
      <button
        type="button"
        className="brand"
        onClick={() => setPage('overview')}
        aria-label="Sentinela do Solo, início do painel"
      >
        <span className="brand-icon">
          <Mountain size={25} />
        </span>

        <span>
          sentinela
          <span className="brand-sub">DO SOLO</span>
        </span>
      </button>

      <div className="workspace-label">
        {citizen
          ? 'ESPAÇO DO CIDADÃO'
          : civil
            ? 'CENTRAL DE OPERAÇÕES'
            : 'MONITORAMENTO FERROVIÁRIO'}
      </div>

      <div className="profile-card">
        <Icon size={21} />

        <div>
          <strong>{account.label}</strong>

          <small>
            {civil
              ? 'Visão de todas as regiões'
              : citizen
                ? 'Informação e preparação'
                : 'Via Serra · empresa fictícia'}
          </small>
        </div>
      </div>

      <nav aria-label="Navegação do painel">
        {nav.map(([id, NavIcon, label]) => (
          <button
            type="button"
            key={id}
            className={`nav-item ${page === id ? 'active' : ''}`}
            aria-current={page === id ? 'page' : undefined}
            onClick={() => setPage(id)}
          >
            <NavIcon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="demo-card">
          <span className="dot" />
          <strong>Ambiente demonstrativo</strong>

          <p>
            Estacas, indicadores e ações operacionais são simulados.
          </p>
        </div>

        <div className="user">
          <span className="avatar">
            <Icon size={18} />
          </span>

          <div>
            <strong>{account.name}</strong>
            <small>Conta de demonstração</small>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="nav-item logout-button"
        onClick={onLogout}
      >
        <LogOut size={18} />
        Sair e voltar ao site
      </button>
    </aside>
  );
}

export function MetricCard({
  icon: Icon,
  title,
  value,
  unit,
  foot,
  tone = ''
}) {
  return (
    <div className={`metric card ${tone}`}>
      <div className="metric-label">
        <span>{title}</span>
        <Icon size={19} />
      </div>

      <div className="metric-value">
        {value}
        <span>{unit}</span>
      </div>

      {foot && <small>{foot}</small>}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>

      {children}
    </div>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="empty">
      <MessagesSquare size={26} />
      <h3>Nenhum relato por aqui</h3>
      <p>{children}</p>
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <span>
        <ShieldCheck size={15} />
        Sentinela do Solo · Projeto acadêmico FIAP
      </span>

      <span>Dados demonstrativos · ODS 11 e 13</span>
    </footer>
  );
}