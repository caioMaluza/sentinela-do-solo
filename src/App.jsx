import { useState } from 'react';

import {
  MapPin,
  Plus,
  CloudRain,
  Activity,
  Droplets,
  Radio,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Check
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

import { clusters } from './data/clusters';
import { risk } from './lib/risk';

import { useReports } from './hooks/useReports';
import { useWeather } from './hooks/useWeather';
import { useStoredState } from './hooks/useStoredState';

// ==================================================
// COMPONENTE PRINCIPAL
// ==================================================

export default function App() {
  // ==================================================
  // ESTADOS DA APLICAÇÃO
  // ==================================================

  const [page, setPage] = useState('overview');
  const [profile, setProfile] = useState('Cidadão');
  const [clusterId, setClusterId] = useState('brasilandia');
  const [form, setForm] = useState(false);
  const [safe, setSafe] = useState(false);
  const [adminDraft, setAdminDraft] = useState('');

  const [decisions, setDecisions] = useStoredState(
    'sentinela-decisions',
    {}
  );

  // ==================================================
  // DADOS E HOOKS
  // ==================================================

  const cluster = clusters.find(c => c.id === clusterId) || clusters[0];

  const state =
    (decisions && typeof decisions === 'object' ? decisions[clusterId] : null) || risk(cluster.rate);

  const api = useReports();

  const {
    weather,
    error: weatherError
  } = useWeather(cluster);

  // ==================================================
  // TÍTULO DINÂMICO
  // ==================================================

  const title =
    page === 'reports'
      ? 'Cada relato faz a diferença.'
      : page === 'map'
        ? 'Conheça o seu território.'
        : page === 'guide'
          ? 'Preparar é uma forma de cuidar.'
          : profile === 'Defesa Civil'
            ? 'Informação para agir com cuidado.'
            : profile === 'Empresa'
              ? 'Proteção que vai além da operação.'
              : 'Sua comunidade, mais protegida.';

  // ==================================================
  // INTERFACE
  // ==================================================

  return (
    <div className="app">
      {/* MENU LATERAL */}

      <Sidebar
        page={page}
        setPage={setPage}
        profile={profile}
        setProfile={setProfile}
      />

      <div className="main-shell">
        {/* CABEÇALHO */}

        <header className="topbar">
          <span>
            Monitoramento de encostas

            <span className="topbar-slash">
              /
            </span>

            <strong>{profile}</strong>
          </span>

          <span className="demo-label">
            <span className="dot" />
            Ambiente de demonstração
          </span>
        </header>

        <main>
          {/* TÍTULO DA PÁGINA */}

          <div className="page-heading">
            <div>
              <p className="eyebrow">
                CUIDADO QUE COMEÇA PERTO DE VOCÊ
              </p>

              <h1>{title}</h1>

              <p className="subtitle">
                Informação clara, participação e mais
                tranquilidade para o seu dia.
              </p>
            </div>

            <Button onClick={() => setForm(true)}>
              <Plus size={18} />
              Registrar relato
            </Button>
          </div>

          {/* SELEÇÃO DA REGIÃO */}

          <div className="region-bar">
            <div>
              <MapPin size={18} />

              <label htmlFor="region">
                Minha região
              </label>

              <select
                id="region"
                value={clusterId}
                onChange={e => {
                  setClusterId(e.target.value);
                  setSafe(false);
                }}
              >
                {clusters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} · São Paulo
                  </option>
                ))}
              </select>
            </div>

            <span>
              <Radio size={14} />
              Sensores em modo simulado
            </span>
          </div>

          {profile === 'Defesa Civil' && (
            <section className="card admin-access">
              <h2>Acesso de triagem · somente demonstração</h2>
              <p className="muted">
                Simulações de evacuação funcionam localmente. Para editar, excluir ou
                mudar a triagem dos relatos compartilhados é necessária a chave do servidor.
              </p>
              {api.adminKey ? (
                <div className="admin-access-row">
                  <span>Chave inserida nesta sessão (validada na próxima alteração).</span>
                  <Button variant="secondary" onClick={() => api.setAdminKey('')}>Sair da triagem</Button>
                </div>
              ) : (
                <form className="admin-access-row" onSubmit={event => {
                  event.preventDefault();
                  api.setAdminKey(adminDraft);
                  setAdminDraft('');
                }}>
                  <input type="password" autoComplete="off" aria-label="Chave de triagem"
                    placeholder="Chave de triagem" minLength={12} required
                    value={adminDraft} onChange={event => setAdminDraft(event.target.value)} />
                  <Button type="submit">Habilitar triagem</Button>
                </form>
              )}
            </section>
          )}

          {/* ===================================== */}
          {/* PÁGINA: VISÃO GERAL                  */}
          {/* ===================================== */}

          {page === 'overview' ? (
            <>
              <StatusBanner
                state={state}
                cluster={cluster}
                onPrepare={() => setPage('guide')}
              />

              {/* MÉTRICAS */}

              <div className="metrics-grid">
                <MetricCard
                  icon={CloudRain}
                  title="Precipitação recente"
                  value={
                    weather && Number.isFinite(weather.precipitation)
                      ? weather.precipitation.toLocaleString('pt-BR')
                      : '—'
                  }
                  unit="mm"
                  foot={
                    weatherError ||
                    (
                      weather
                        ? 'Open-Meteo · ' +
                          weather.time.replace('T', ' às ')
                        : 'Consultando Open-Meteo…'
                    )
                  }
                />

                <MetricCard
                  icon={Activity}
                  title="Movimento do solo"
                  value={
                    cluster.rate
                      .toFixed(3)
                      .replace('.', ',')
                  }
                  unit="°/h"
                  foot="Leitura simulada · margem de atenção 40%"
                  tone="amber-text"
                />

                <MetricCard
                  icon={Droplets}
                  title="Umidade do solo"
                  value={cluster.humidity}
                  unit="%"
                  foot="Leitura simulada da estaca"
                />

                <MetricCard
                  icon={Radio}
                  title="Estaca de referência"
                  value={cluster.sensor}
                  unit=""
                  foot="Sensor demonstrativo · sem hardware conectado"
                  tone="green-text"
                />
              </div>

              {/* ALERTA DE CHUVA */}

              {weather &&
                weather.precipitation >= 5 &&
                cluster.rate > 0 && (
                  <p className="notice">
                    Alerta sugerido para análise:
                    chuva intensa e movimento do solo
                    no cenário. A decisão depende da
                    avaliação da Defesa Civil.
                  </p>
                )}

              {/* PAINEL DA DEFESA CIVIL */}

              {profile === 'Defesa Civil' && (
                <CivilPanel
                  key={cluster.id}
                  cluster={cluster}
                  decision={decisions[clusterId]}
                  onDecision={value =>
                    setDecisions(previous => ({
                      ...previous,
                      [clusterId]: value
                    }))
                  }
                />
              )}

              {/* PAINEL EMPRESARIAL */}

              {profile === 'Empresa' && (
                <CompanyPanel />
              )}

              {/* MAPA E PREVENÇÃO */}

              <div className="dashboard-grid">
                <RegionMap cluster={cluster} />

                <div className="care-card">
                  <span className="care-icon">
                    <ShieldCheck size={30} />
                  </span>

                  <p className="eyebrow">
                    PREVENÇÃO NO DIA A DIA
                  </p>

                  <h2>
                    Um pouco de preparo.
                    <br />
                    Muito mais segurança.
                  </h2>

                  <p>
                    Documentos, remédios e um plano
                    em família. Pequenas ações fazem
                    a diferença.
                  </p>

                  <Button
                    variant="secondary"
                    onClick={() => setPage('guide')}
                  >
                    Abrir meu checklist
                    <ArrowRight size={16} />
                  </Button>

                  <div className="care-bottom">
                    <span>01</span>

                    <p>
                      Comece pelo essencial.
                      <br />
                      <strong>
                        No seu tempo, com calma.
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* SIMULAÇÃO DE EVACUAÇÃO */}

              {state === 'evacuation' && (
                <div className="my-5">
                  <ShelterRoute cluster={cluster} />

                  <Button onClick={() => setSafe(true)}>
                    {safe ? (
                      <>
                        <Check size={16} />
                        Confirmação salva nesta sessão
                      </>
                    ) : (
                      'Já estou em local seguro (simulação)'
                    )}
                  </Button>
                </div>
              )}

              {/* RELATOS RESUMIDOS */}

              <ReportList
                api={api}
                cluster={cluster}
                compact
                triage={profile === 'Defesa Civil'}
                onNew={() => setForm(true)}
              />

              {/* COMPROMISSO ESG */}

              <div className="esg-strip">
                <Leaf size={25} />

                <div>
                  <strong>
                    Uma rede de cuidado.
                    Sem custo para o cidadão.
                  </strong>

                  <p>
                    Monitoramento, ciência e participação
                    unidos por comunidades mais resilientes.
                  </p>
                </div>

                <Badge>
                  ODS 11 + 13
                </Badge>
              </div>
            </>

          /* ===================================== */
          /* PÁGINA: RELATOS                       */
          /* ===================================== */

          ) : page === 'reports' ? (
            <ReportList
              api={api}
              cluster={cluster}
              triage={profile === 'Defesa Civil'}
              onNew={() => setForm(true)}
            />

          /* ===================================== */
          /* PÁGINA: MAPA                          */
          /* ===================================== */

          ) : page === 'map' ? (
            <>
              <RegionMap
                cluster={cluster}
                expanded
              />

              <p className="notice">
                Este mapa apresenta áreas ilustrativas.
                Abrigos e rotas de emergência precisam
                de validação oficial antes de uso real.
              </p>

              {state === 'evacuation' && (
                <ShelterRoute cluster={cluster} />
              )}
            </>

          /* ===================================== */
          /* PÁGINA: GUIA DE PREPARAÇÃO            */
          /* ===================================== */

          ) : (
            <>
              <Checklist />

              <section className="card p-6 mt-5">
                <h2>
                  Como a rede Sentinela funciona
                </h2>

                <div className="cluster-grid">
                  <div>
                    <h3>01 · Observar</h3>

                    <p>
                      Sensores medem o movimento do solo.
                      Moradores contribuem com relatos.
                    </p>
                  </div>

                  <div>
                    <h3>02 · Analisar</h3>

                    <p>
                      Dados da encosta e da chuva
                      ajudam a apontar alterações.
                    </p>
                  </div>

                  <div>
                    <h3>03 · Cuidar</h3>

                    <p>
                      A Defesa Civil avalia os indícios
                      e autoriza as decisões sobre a população.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* AVISO ACADÊMICO */}

          <p className="academic-note">
            Protótipo acadêmico · FIAP Global Solution 2026.2.
            Indicadores de solo e decisões operacionais são simulados, não alertas reais.
            Não substitui monitoramento ou orientações oficiais.
            Os perfis são demonstrativos e não comprovam vínculo com órgãos públicos.
          </p>

          <Footer />
        </main>
      </div>

      {/* MODAL DE NOVO RELATO */}

      {form && (
        <ReportForm
          cluster={cluster}
          onSave={api.save}
          busy={api.busy}
          apiError={api.error}
          onClose={() => setForm(false)}
        />
      )}
    </div>
  );
}
