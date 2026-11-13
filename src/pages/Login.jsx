import { useState } from 'react';

import {
  Mountain,
  ArrowLeft,
  ArrowRight,
  Users,
  ShieldCheck,
  TrainFront,
  Eye,
  EyeOff
} from 'lucide-react';

import { DEMO_ACCOUNTS, authenticateDemo } from '../lib/demoAuth';
import './PublicPages.css';

const icons = {
  citizen: Users,
  civil: ShieldCheck,
  company: TrainFront
};

export default function Login({
  onLogin,
  onBack,
  initialRole = 'citizen'
}) {
  const initial = DEMO_ACCOUNTS.find(
    account => account.id === initialRole
  ) || DEMO_ACCOUNTS[0];

  const [selected, setSelected] = useState(initial.id);
  const [email, setEmail] = useState(initial.email);
  const [password, setPassword] = useState(initial.password);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  function choose(account) {
    setSelected(account.id);
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  }

  function submit(event) {
    event.preventDefault();

    const account = authenticateDemo(email, password);

    if (!account) {
      setError(
        'E-mail ou senha inválidos. Escolha um acesso demonstrativo abaixo.'
      );
      return;
    }

    onLogin(account);
  }

  return (
    <div className="login-page">
      <section className="login-story">
        <button className="login-back" onClick={onBack}>
          <ArrowLeft size={17} />
          Voltar ao site
        </button>

        <a href="#login-form" className="public-brand">
          <Mountain size={30} />

          <span>
            sentinela
            <small>DO SOLO</small>
          </span>
        </a>

        <div>
          <span className="public-tag">
            CONECTADOS PELO TERRITÓRIO
          </span>

          <h1>
            Cada olhar ajuda
            <br />
            a proteger
            <br />
            <em>mais vidas.</em>
          </h1>

          <p>
            Um espaço para quem vive, acompanha e cuida
            das áreas monitoradas.
          </p>
        </div>

        <p className="login-story-note">
          <ShieldCheck size={19} />
          Projeto acadêmico FIAP
          <br />
          Tecnologia a serviço da prevenção.
        </p>
      </section>

      <main className="login-main">
        <div className="login-form-wrap" id="login-form">
          <p className="section-kicker">BEM-VINDO AO SENTINELA</p>
          <h2>Acesse sua plataforma.</h2>

          <p className="login-intro">
            Escolha um perfil para preencher os dados de exemplo.
          </p>

          <div
            className="login-roles"
            aria-label="Contas demonstrativas"
          >
            {DEMO_ACCOUNTS.map(account => {
              const Icon = icons[account.id];

              return (
                <button
                  type="button"
                  key={account.id}
                  className={selected === account.id ? 'selected' : ''}
                  aria-pressed={selected === account.id}
                  onClick={() => choose(account)}
                >
                  <Icon size={21} />
                  <strong>{account.label}</strong>

                  <small>
                    {account.id === 'company'
                      ? 'Via Serra'
                      : account.id === 'civil'
                        ? 'Todas as áreas'
                        : 'Minha comunidade'}
                  </small>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit}>
            <label htmlFor="login-email">
              E-mail de demonstração
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={event => {
                setEmail(event.target.value);
                setError('');
              }}
            />

            <label htmlFor="login-password">Senha</label>

            <div className="password-field">
              <input
                id="login-password"
                name="password"
                type={visible ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={event => {
                  setPassword(event.target.value);
                  setError('');
                }}
              />

              <button
                type="button"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="public-button">
              Entrar na demonstração
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="login-disclosure">
            <ShieldCheck size={21} />

            <p>
              <strong>Acesso de apresentação</strong>

              Contas públicas de exemplo. Este login funciona no
              navegador e não oferece autenticação real.
              Senha dos três perfis: <code>Sentinela@2026</code>.
            </p>
          </div>

          <button
            className="public-link login-home"
            onClick={onBack}
          >
            <ArrowLeft size={15} />
            Conhecer o projeto
          </button>
        </div>
      </main>
    </div>
  );
}