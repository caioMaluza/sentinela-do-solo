import { useState } from 'react';
import {
  Activity,
  CloudRain,
  Droplets,
  Radio,
  MapPin,
  TriangleAlert,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

import {
  Sidebar,
  Footer,
  Button,
  MetricCard,
  Badge
} from './components/UI';

import { StatusBanner } from './components/StatusBanner';
import { Checklist } from './components/Checklist';
import { RegionMap, ShelterRoute } from './components/RegionMap';
import { ReportForm, ReportList } from './components/Reports';
import { CivilPanel, CompanyPanel } from './pages/Operations';

import Landing from './pages/Landing';
import Login from './pages/Login';

import { getDemoAccount } from './lib/demoAuth';
import { clusters } from './data/clusters';
import { getNearbyShelters } from './data/shelters';
import { risk } from './lib/risk';

import { useReports } from './hooks/useReports';
import { useWeather } from './hooks/useWeather';
import { useStoredState } from './hooks/useStoredState';

const SESSION_KEY = 'sentinela-demo-account';

function readSession() {
  try {
    return getDemoAccount(sessionStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export default function App() {
  const [account, setAccount] = useState(readSession);
  const [view, setView] = useState('landing');
  const [initialRole, setInitialRole] = useState('citizen');

  function login(next) {
    try {
      sessionStorage.setItem(SESSION_KEY, next.id);
    } catch {
      // Manter sessão em memória quando o armazenamento estiver bloqueado.
    }

    setAccount(next);
    window.scrollTo(0, 0);
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem('sentinela-admin-key');
    } catch {
      // A sessão em memória também é removida abaixo.
    }

    setAccount(null);
    setView('landing');
    window.scrollTo(0, 0);
  }

  if (account) {
    return (
      <Workspace
        key={account.id}
        account={account}
        onLogout={logout}
      />
    );
  }

  if (view === 'login') {
    return (
      <Login
        initialRole={initialRole}
        onLogin={login}
        onBack={() => setView('landing')}
      />
    );
  }

  return (
    <Landing
      onLogin={role => {
        setInitialRole(role || 'citizen');
        setView('login');
        window.scrollTo(0, 0);
      }}
    />
  );
}

function Workspace({ account, onLogout }) {
  const [page, setPage] = useState('overview');

  const regions = account.role === 'company'
    ? clusters.filter(region => region.companyId === account.companyId)
    : clusters;

  const [clusterId, setClusterId] = useState(regions[0].id);

  const cluster = regions.find(region => region.id === clusterId)
    || regions[0];

  const [storedDecisions, setDecisions] = useStoredState(
    'sentinela-decisions',
    {}
  );

  const decisions = (
    storedDecisions
    && typeof storedDecisions === 'object'
    && !Array.isArray(storedDecisions)
  )
    ? Object.fromEntries(
        Object.entries(storedDecisions).filter(([id, value]) =>
          clusters.some(region => region.id === id)
          && ['evacuation', 'returned'].includes(value)
        )
      )
    : {};

  const [citizenAlerts, setCitizenAlerts] = useState({});
  const [selectedShelterId, setSelectedShelterId] = useState(null);

  const citizen = account.role === 'citizen';
  const civil = account.role === 'civil';

  const state = citizen && citizenAlerts[cluster.id]
    ? 'evacuation'
    : decisions[cluster.id] || risk(cluster.rate);

  const red = citizen && ['critical', 'evacuation'].includes(state);

  const mapDecisions = citizen && citizenAlerts[cluster.id]
    ? { ...decisions, [cluster.id]: 'evacuation' }
    : decisions;

  const shelters = red ? getNearbyShelters(cluster) : [];

  function chooseRegion(id) {
    if (!regions.some(region => region.id === id)) return;
    setClusterId(id);
    setSelectedShelterId(null);
  }

  const heading = page === 'reports'
    ? civil ? 'Triagem de relatos' : 'Relatos da comunidade'
    : page === 'guide'
      ? 'Sua preparação começa aqui'
      : page === 'map'
        ? citizen ? 'Mapa da sua região' : 'Mapa de monitoramento'
        : civil
          ? 'Dashboard da Defesa Civil'
          : citizen
            ? 'Sua comunidade, mais protegida'
            : 'Dashboard Via Serra';

  const mapProps = {
    cluster,
    regions,
    decisions: mapDecisions,
    showShelters: red,
    shelters,
    selectedShelterId,
    onSelectShelter: setSelectedShelterId,
    onSelectRegion: chooseRegion,
    allowLocation: citizen
  };

  return (
    <div className={`app role-${account.role}`}>
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>

      <Sidebar
        page={page}
        setPage={setPage}
        account={account}
        onLogout={onLogout}
      />

      <div className="main-shell">
        <header className="topbar">
          <span>
            Plataforma Sentinela
            <span className="topbar-slash">/</span>
            <strong>{account.label}</strong>
          </span>

          <span className="demo-label">
            <span className="dot" />
            Demonstração acadêmica
          </span>
        </header>

        <main id="main-content" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                {civil
                  ? 'VISÃO INTEGRADA DO TERRITÓRIO'
                  : citizen
                    ? 'INFORMAÇÃO PERTO DE VOCÊ'
                    : 'GESTÃO DOS ATIVOS DA SUA EMPRESA'}
              </p>

              <h1>{heading}</h1>

              <p className="subtitle">
                {civil
                  ? 'Áreas monitoradas, estacas e decisões em uma única central.'
                  : citizen
                    ? 'Acompanhe o cenário, prepare sua família e participe.'
                    : 'Trechos ferroviários e estacas da Via Serra, empresa fictícia.'}
              </p>
            </div>

            <Badge tone="blue">
              <Radio size={13} />
              Estacas simuladas
            </Badge>
          </div>

          <div className="region-bar">
            <div className="region-picker">
              <MapPin size={17} />

              <label htmlFor="region">
                {citizen ? 'Minha região' : 'Área selecionada'}
              </label>

              <select
                id="region"
                value={cluster.id}
                onChange={event => chooseRegion(event.target.value)}
              >
                {regions.map(region => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <span>
              {citizen
                ? cluster.area
                : `${regions.length} áreas no seu painel · dados ilustrativos`}
            </span>
          </div>

          {citizen && ['overview', 'map'].includes(page) && (
            <>
              <div className="simulation-bar">
                <div>
                  <TriangleAlert size={18} />

                  <span>
                    <strong>Explore o alerta vermelho</strong>
                    <small>
                      Uma simulação para conhecer a indicação de abrigos.
                    </small>
                  </span>
                </div>

                <Button
                  variant={citizenAlerts[cluster.id] ? 'secondary' : 'danger'}
                  onClick={() => {
                    setCitizenAlerts(previous => ({
                      ...previous,
                      [cluster.id]: !previous[cluster.id]
                    }));

                    setSelectedShelterId(null);
                  }}
                >
                  {citizenAlerts[cluster.id] ? (
                    <>
                      <RotateCcw size={15} />
                      Encerrar meu teste
                    </>
                  ) : (
                    <>
                      <TriangleAlert size={15} />
                      Simular alerta vermelho
                    </>
                  )}
                </Button>
              </div>

              <StatusBanner
                cluster={cluster}
                state={state}
                onPrepare={() => setPage('guide')}
              />

              {citizenAlerts[cluster.id] === false
                && ['critical', 'evacuation'].includes(state) && (
                  <p className="inline-note">
                    Seu teste terminou. O cenário da região continua crítico
                    na demonstração; por isso, os abrigos permanecem visíveis.
                  </p>
                )}
            </>
          )}

          {page === 'overview' && (
            citizen ? (
              <>
                <CitizenMetrics cluster={cluster} />

                <div className={`citizen-grid ${red ? 'with-shelters' : ''}`}>
                  <RegionMap
                    {...mapProps}
                    title="Sua região e as estacas"
                  />

                  {red ? (
                    <ShelterRoute
                      cluster={cluster}
                      shelters={shelters}
                      selectedShelterId={selectedShelterId}
                      onSelectShelter={setSelectedShelterId}
                    />
                  ) : (
                    <section className="card preparation-card">
                      <p className="eyebrow">PREVENÇÃO NO DIA A DIA</p>

                      <h2>
                        Um plano para quem você quer proteger.
                      </h2>

                      <p>
                        Organize documentos, itens essenciais e um ponto
                        de encontro para sua família.
                      </p>

                      <Button
                        variant="secondary"
                        onClick={() => setPage('guide')}
                      >
                        Abrir minha preparação
                        <ArrowRight size={16} />
                      </Button>
                    </section>
                  )}
                </div>

                <ReportsWorkspace
                  key={`citizen-${cluster.id}`}
                  cluster={cluster}
                  compact
                />
              </>
            ) : civil ? (
              <CivilPanel
                key={cluster.id}
                cluster={cluster}
                decision={decisions[cluster.id]}
                decisions={decisions}
                regions={regions}
                onSelectRegion={chooseRegion}
                onDecision={value => {
                  setDecisions(previous => ({
                    ...previous,
                    [cluster.id]: value
                  }));
                }}
              />
            ) : (
              <CompanyPanel
                cluster={cluster}
                regions={regions}
                decisions={decisions}
                onSelectRegion={chooseRegion}
              />
            )
          )}

          {page === 'map' && (
            <>
              <RegionMap
                {...mapProps}
                title={citizen
                  ? 'Mapa da região'
                  : 'Todas as áreas do seu painel'}
                expanded
                overview={!citizen}
              />

              {red && (
                <ShelterRoute
                  cluster={cluster}
                  shelters={shelters}
                  selectedShelterId={selectedShelterId}
                  onSelectShelter={setSelectedShelterId}
                />
              )}
            </>
          )}

          {page === 'guide' && citizen && (
            <>
              <Checklist />

              <section className="card panel-padding contact-card">
                <h2>Em uma situação real</h2>

                <p>
                  Acompanhe a Defesa Civil e siga as orientações locais.
                  Os abrigos do protótipo não são pontos oficiais.
                </p>

                <div className="contact-links">
                  <a href="tel:199">Defesa Civil · 199</a>
                  <a href="tel:193">Bombeiros · 193</a>
                </div>
              </section>
            </>
          )}

          {page === 'reports' && account.role !== 'company' && (
            <ReportsWorkspace
              key={`${account.id}-${cluster.id}`}
              cluster={cluster}
              civil={civil}
            />
          )}

          <p className="academic-note">
            Protótipo acadêmico. Leituras, áreas de risco, gráficos e abrigos
            são ilustrativos. As simulações deste navegador não emitem
            alertas reais. Mapas: OpenStreetMap; clima, quando disponível:
            Open-Meteo.
          </p>

          <Footer />
        </main>
      </div>
    </div>
  );
}

function CitizenMetrics({ cluster }) {
  const { weather, error } = useWeather(cluster);

  return (
    <div className="metrics-grid">
      <MetricCard
        icon={CloudRain}
        title="Precipitação atual"
        value={weather && Number.isFinite(weather.precipitation)
          ? weather.precipitation.toLocaleString('pt-BR')
          : '—'}
        unit="mm"
        foot={error || 'Open-Meteo · dado meteorológico atual'}
      />

      <MetricCard
        icon={Activity}
        title="Movimento do solo"
        value={cluster.rate.toLocaleString('pt-BR', {
          maximumFractionDigits: 3
        })}
        unit="°/h"
        foot="Leitura simulada da estaca de referência"
      />

      <MetricCard
        icon={Droplets}
        title="Umidade do solo"
        value={cluster.humidity}
        unit="%"
        foot="Indicador demonstrativo"
      />

      <MetricCard
        icon={Radio}
        title="Estacas na região"
        value={cluster.sensors}
        unit="estacas"
        foot={`Referência: ${cluster.sensor} · simulação`}
      />
    </div>
  );
}

function ReportsWorkspace({ cluster, civil = false, compact = false }) {
  const api = useReports();
  const [form, setForm] = useState(false);
  const [adminDraft, setAdminDraft] = useState('');

  return (
    <>
      {civil && (
        <section className="card admin-access">
          <h2>Acesso à triagem de relatos</h2>

          <p className="muted">
            O login demonstrativo não concede acesso administrativo à API.
            Informe a chave configurada no servidor para editar a triagem.
          </p>

          {api.adminKey ? (
            <div className="admin-access-row">
              <span>
                Chave inserida; a API validará na próxima alteração.
              </span>

              <Button
                variant="secondary"
                onClick={() => api.setAdminKey('')}
              >
                Remover chave
              </Button>
            </div>
          ) : (
            <form
              className="admin-access-row"
              onSubmit={event => {
                event.preventDefault();
                api.setAdminKey(adminDraft);
                setAdminDraft('');
              }}
            >
              <label htmlFor="triage-key" className="sr-only">
                Chave de triagem do servidor
              </label>

              <input
                id="triage-key"
                type="password"
                autoComplete="off"
                placeholder="Chave de triagem do servidor"
                minLength={12}
                required
                value={adminDraft}
                onChange={event => setAdminDraft(event.target.value)}
              />

              <Button type="submit">Habilitar triagem</Button>
            </form>
          )}
        </section>
      )}

      <ReportList
        api={api}
        cluster={cluster}
        triage={civil}
        compact={compact}
        onNew={() => setForm(true)}
      />

      {form && (
        <ReportForm
          cluster={cluster}
          onSave={api.save}
          onClose={() => setForm(false)}
          busy={api.busy}
          apiError={api.error}
        />
      )}
    </>
  );
}