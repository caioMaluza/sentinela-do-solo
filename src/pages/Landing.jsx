import {
  Mountain,
  ArrowRight,
  ShieldCheck,
  Radio,
  Users,
  TrainFront,
  MapPin,
  Activity
} from 'lucide-react';

import '../pages/PublicPages';

export default function Landing({ onLogin }) {
  return (
    <div className="landing">
      <header className="public-header">
        <a className="public-brand" href="#inicio">
          <Mountain size={29} />

          <span>
            sentinela
            <small>DO SOLO</small>
          </span>
        </a>

        <nav aria-label="Navegação do site">
          <a href="#sobre">O projeto</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#perfis">Para quem</a>
        </nav>

        <button
          className="public-button small"
          onClick={() => onLogin()}
        >
          Login
          <ArrowRight size={15} />
        </button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="public-tag">
              <span />
              TECNOLOGIA PARA A PREVENÇÃO
            </span>

            <h1>
              Antecipar riscos.
              <br />
              <em>Proteger vidas.</em>
            </h1>

            <p>
              Informação sobre o solo para conectar comunidades,
              Defesa Civil e empresas no cuidado com o território.
            </p>

            <div className="hero-actions">
              <button
                className="public-button"
                onClick={() => onLogin()}
              >
                Conhecer a plataforma
                <ArrowRight size={17} />
              </button>

              <a className="public-link" href="#como-funciona">
                Entenda o projeto
              </a>
            </div>

            <p className="hero-note">
              <ShieldCheck size={16} />
              Protótipo acadêmico · FIAP · Dados ilustrativos
            </p>
          </div>

          <div
            className="hero-preview"
            role="img"
            aria-label="Ilustração de um dashboard com mapa, riscos e gráficos fictícios"
          >
            <div className="preview-top">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>

              <strong>Central de monitoramento</strong>
              <span>DEMO</span>
            </div>

            <div className="preview-body">
              <div className="preview-menu">
                <Mountain size={22} />
                <i />
                <i />
                <i />
                <i />
              </div>

              <div className="preview-main">
                <span className="preview-caption">
                  VISÃO DO TERRITÓRIO
                </span>

                <div className="preview-map">
                  <svg viewBox="0 0 360 240" aria-hidden="true">
                    <rect width="360" height="240" fill="#e5eddf" />

                    <path
                      d="M0 45L95 8l70 32 80-29 115 25M0 137l85-28 101 25 84-67 90 45M35 0l23 75-17 76 72 89M185 0l-30 76 56 70-12 94M297 0l-17 96 47 78-12 66"
                      fill="none"
                      stroke="#b8cbb9"
                      strokeWidth="3"
                    />

                    <path
                      d="M97 63l75-12 66 27 31 61-43 53-67 17-68-49z"
                      fill="#e6c758"
                      opacity=".7"
                    />

                    <path
                      d="M179 85l57 5 27 50-40 42-56-5-22-43z"
                      fill="#d87e7f"
                      opacity=".85"
                    />

                    <path
                      d="M0 195Q100 130 154 177T360 150"
                      fill="none"
                      stroke="#97bfd1"
                      strokeWidth="11"
                    />

                    <circle
                      cx="199"
                      cy="126"
                      r="7"
                      fill="#b83d50"
                      stroke="white"
                      strokeWidth="3"
                    />

                    <circle
                      cx="91"
                      cy="102"
                      r="6"
                      fill="#498a69"
                      stroke="white"
                      strokeWidth="3"
                    />

                    <circle
                      cx="264"
                      cy="194"
                      r="6"
                      fill="#b28b29"
                      stroke="white"
                      strokeWidth="3"
                    />
                  </svg>

                  <span>Áreas de risco ilustrativas</span>
                </div>

                <div className="preview-charts">
                  <div>
                    <small>Famílias por área · demo</small>

                    <svg viewBox="0 0 150 55" aria-hidden="true">
                      <path
                        d="M0 50L0 43 28 34 56 39 83 19 110 24 150 3 150 50z"
                        fill="#c4d9ef"
                      />

                      <path
                        d="M0 43L28 34 56 39 83 19 110 24 150 3"
                        stroke="#618bb8"
                        fill="none"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div>
                    <small>Precipitação · demo</small>

                    <span className="preview-bars">
                      {[22, 36, 28, 48, 33, 63, 55, 80].map((value, index) => (
                        <i key={index} style={{ height: `${value}%` }} />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="preview-aside">
                <small>Risco geológico</small>
                <strong className="preview-risk">Médio</strong>

                <hr />

                <small>Precipitação simulada</small>
                <strong>80 <small>mm</small></strong>

                <hr />

                <small>Áreas em alerta</small>
                <strong>2</strong>

                <span className="preview-alert">
                  Cenário ilustrativo
                </span>
              </div>
            </div>

            <div className="preview-footer">
              <span />
              <span />
              <span />
              Leituras simuladas
            </div>
          </div>
        </section>

        <div className="public-principles">
          <span><Radio size={18} />Monitoramento de estacas</span>
          <span><MapPin size={18} />Visão do território</span>
          <span><Users size={18} />Participação comunitária</span>
          <span><ShieldCheck size={18} />Decisão humana</span>
        </div>

        <section className="about-section public-section" id="sobre">
          <div>
            <p className="section-kicker">O PROJETO</p>

            <h2>
              O cuidado começa antes
              <br />
              da emergência.
            </h2>
          </div>

          <div>
            <p>
              O Sentinela do Solo propõe reunir leituras de estacas,
              informações geográficas e relatos da comunidade para
              apoiar a compreensão de riscos geológicos.
            </p>

            <p>
              Neste protótipo, você explora como cada perfil pode
              acompanhar seu território e simular uma resposta.
              As decisões reais continuam dependendo da avaliação
              técnica e dos órgãos responsáveis.
            </p>

            <span className="public-tag">
              GLOBAL SOLUTION 2026.2 · FIAP
            </span>
          </div>
        </section>

        <section
          className="public-section how-section"
          id="como-funciona"
        >
          <p className="section-kicker">DA LEITURA AO CUIDADO</p>

          <h2>
            Informação que aproxima
            <br />
            quem precisa agir.
          </h2>

          <div className="how-grid">
            {[
              [
                Radio,
                '01',
                'Observar o solo',
                'Estacas ilustrativas representam leituras de movimento e umidade nas regiões monitoradas.'
              ],
              [
                Activity,
                '02',
                'Entender o cenário',
                'Mapas, indicadores e relatos ajudam a visualizar o território em cada perfil.'
              ],
              [
                ShieldCheck,
                '03',
                'Preparar uma resposta',
                'A Defesa Civil simula decisões; cidadãos conhecem a preparação e os abrigos fictícios.'
              ]
            ].map(([Icon, step, title, description]) => (
              <article key={step}>
                <div>
                  <Icon size={24} />
                  <span>{step}</span>
                </div>

                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="public-section profiles-section"
          id="perfis"
        >
          <p className="section-kicker">
            UM TERRITÓRIO, DIFERENTES RESPONSABILIDADES
          </p>

          <h2>Uma experiência para cada perfil.</h2>

          <div className="public-profiles">
            {[
              [
                Users,
                'citizen',
                'Para a comunidade',
                'Consulte sua região, registre relatos e conheça a simulação de alerta vermelho com abrigos ilustrativos.'
              ],
              [
                ShieldCheck,
                'civil',
                'Para a Defesa Civil',
                'Acompanhe todas as áreas, estacas, alertas e indicadores em uma central de operações.'
              ],
              [
                TrainFront,
                'company',
                'Para empresas',
                'Visualize somente os ativos da Via Serra, ferrovia fictícia, e simule ações sobre a circulação.'
              ]
            ].map(([Icon, role, title, description]) => (
              <article key={role}>
                <Icon size={27} />
                <h3>{title}</h3>
                <p>{description}</p>

                <button
                  className="public-link"
                  onClick={() => onLogin(role)}
                >
                  Explorar este perfil
                  <ArrowRight size={15} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="public-cta">
          <div>
            <p className="section-kicker">CONHEÇA NA PRÁTICA</p>

            <h2>
              Explore uma comunidade
              <br />
              mais preparada.
            </h2>

            <p>
              Três acessos demonstrativos.
              Diferentes formas de cuidar.
            </p>
          </div>

          <button
            className="public-button"
            onClick={() => onLogin()}
          >
            Acessar demonstração
            <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <footer className="public-footer">
        <span>
          <Mountain size={20} />
          Sentinela do Solo · FIAP
        </span>

        <p>
          Protótipo acadêmico. Dados, alertas e abrigos ilustrativos;
          não substituem orientações oficiais.
        </p>

        <span>ODS 11 e 13 · 2026</span>
      </footer>
    </div>
  );
}