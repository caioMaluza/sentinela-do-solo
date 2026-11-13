import { useId, useState } from 'react';

import {
  Mountain,
  ArrowRight,
  ShieldCheck,
  Radio,
  Users,
  TrainFront,
  MapPin,
  MoveUpRight,
  Sun,
  CloudRain,
  BellRing,
  Check
} from 'lucide-react';

import { clusters } from '../data/clusters';

import './PublicPages.css';
import './LandingInteractions.css';

const SCENARIOS = [
  {
    id: 'daily',
    label: 'Dia a dia',
    Icon: Sun,
    title: 'Conhecer o bairro já é um começo.',
    text: 'Acompanhe as informações e deixe sua preparação em dia. Neste exemplo, nenhum alerta está ativo.',
    action: 'Conhecer minha preparação'
  },
  {
    id: 'rain',
    label: 'Chuva',
    Icon: CloudRain,
    title: 'Começou a chover. E agora?',
    text: 'Veja os comunicados da sua região, mantenha os itens essenciais por perto e acompanhe as orientações oficiais.',
    action: 'Ver o que acompanhar'
  },
  {
    id: 'alert',
    label: 'Alerta de teste',
    Icon: BellRing,
    title: 'Um aviso claro, sem adivinhar o mapa.',
    text: 'No exercício de alerta, você encontra o aviso do bairro e exemplos de abrigos. Os pontos são fictícios; não use esta demonstração para se deslocar.',
    action: 'Conhecer o alerta de teste'
  }
];

const ROLES = [
  {
    id: 'citizen',
    title: 'Eu moro aqui.',
    label: 'Cidadão',
    Icon: Users,
    text: 'O que importa para sua família, em uma linguagem direta.',
    items: [
      'Situação do bairro',
      'Avisos e abrigos ilustrativos',
      'Relatos e preparação familiar'
    ]
  },
  {
    id: 'civil',
    title: 'Eu acompanho o território.',
    label: 'Defesa Civil',
    Icon: ShieldCheck,
    text: 'O conjunto das informações para quem precisa analisar e decidir.',
    items: [
      'Todos os bairros do recorte',
      'Solos, estacas e carta geotécnica',
      'Simulações de decisão e triagem'
    ]
  },
  {
    id: 'company',
    title: 'Eu cuido da operação.',
    label: 'Empresa',
    Icon: TrainFront,
    text: 'Uma visão própria dos trechos da Via Serra, ferrovia fictícia.',
    items: [
      'Somente os ativos da empresa',
      'Camadas técnicas e indicadores',
      'Circulação simulada por trecho'
    ]
  }
];

function SoilDrawing({ scenario }) {
  const uid = useId().replace(/:/g, '');

  return (
    <figure className={`soil-drawing scene-${scenario}`}>
      <div className="drawing-label">
        <span className="dot" />
        CADERNO DE CAMPO · SÃO PAULO
      </div>

      <svg
        viewBox="0 0 620 465"
        role="img"
        aria-labelledby={`${uid}-title`}
      >
        <title id={`${uid}-title`}>
          Corte ilustrativo do solo de um bairro, com uma estaca
          e camadas de argila, areia e silte.
          Sem escala ou valor geológico.
        </title>

        <defs>
          <clipPath id={`${uid}-terrain-clip`}>
            <path d="M28 213Q101 189 165 207T300 191 429 209 592 190V392Q467 440 315 413T28 419Z" />
          </clipPath>

          <pattern
            id={`${uid}-soil-dots`}
            width="17"
            height="17"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="4"
              cy="5"
              r="1.4"
              fill="#976d39"
              opacity=".4"
            />
          </pattern>

          <pattern
            id={`${uid}-soil-hatch`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(25)"
          >
            <path
              d="M0 0V14"
              stroke="#973d2d"
              strokeWidth="1.5"
              opacity=".3"
            />
          </pattern>
        </defs>

        <path
          d="M369 43a113 113 0 0 1 171 122"
          fill="none"
          stroke="#c4d9ab"
          strokeWidth="42"
        />

        <path
          d="M42 173Q128 148 210 171T386 156 582 170"
          fill="none"
          stroke="#b9cfa8"
          strokeWidth="2"
          strokeDasharray="4 9"
        />

        <g
          fill="#eee5ce"
          stroke="#173f36"
          strokeWidth="2.5"
          strokeLinejoin="round"
        >
          <path d="M82 202v-57l32-25 32 25v57z" />
          <path d="M71 147l43-34 42 34" fill="#cc6842" />
          <path d="M416 204v-67l38-27 38 27v67z" />
          <path d="M405 140l49-37 49 37" fill="#dce879" />
        </g>

        <g fill="#173f36">
          <path d="M108 174h13v28h-13zM434 145h12v14h-12zM465 145h12v14h-12zM447 177h14v27h-14z" />
          <circle cx="536" cy="154" r="26" />
          <circle cx="519" cy="166" r="22" />
          <circle cx="553" cy="170" r="21" />
        </g>

        <path
          d="M537 168v37"
          stroke="#7c6746"
          strokeWidth="6"
        />

        <g clipPath={`url(#${uid}-terrain-clip)`}>
          <path d="M20 190H600V435H20z" fill="#d8b75b" />

          <path
            d="M20 190H600V260Q467 239 341 278T20 260Z"
            fill="#cc7957"
          />

          <path
            d="M20 190H600V260Q467 239 341 278T20 260Z"
            fill={`url(#${uid}-soil-hatch)`}
          />

          <path
            d="M20 344Q160 309 284 349T600 318V445H20Z"
            fill="#8fa783"
          />

          <path
            d="M20 270Q147 300 295 276T600 283V330Q467 362 282 345T20 349Z"
            fill={`url(#${uid}-soil-dots)`}
          />

          <path
            d="M36 231Q160 213 290 230T582 226"
            fill="none"
            stroke="#f6dfbc"
            strokeWidth="3"
          />

          <path
            d="M118 193v218M465 200v218"
            fill="none"
            stroke="#fff5d7"
            strokeWidth="2"
            strokeDasharray="6 7"
            opacity=".75"
          />
        </g>

        <path
          d="M28 213Q101 189 165 207T300 191 429 209 592 190"
          fill="none"
          stroke="#446748"
          strokeWidth="9"
          strokeLinecap="round"
        />

        <path
          d="M223 114v214"
          stroke="#173f36"
          strokeWidth="11"
          strokeLinecap="round"
        />

        <path
          d="M216 194h14M216 233h14M216 273h14M216 311h14"
          stroke="#f7f3e9"
          strokeWidth="2"
        />

        <rect
          x="205"
          y="97"
          width="36"
          height="34"
          rx="6"
          fill="#dce879"
          stroke="#173f36"
          strokeWidth="3"
        />

        <circle cx="223" cy="113" r="4" fill="#173f36" />

        <path
          d="M252 99q17 15 0 31M264 87q31 27 0 55"
          fill="none"
          stroke="#173f36"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <g fontFamily="system-ui,sans-serif" fill="#173f36">
          <text x="48" y="70" fontSize="13" fontWeight="700">
            Uma estaca.
          </text>

          <text x="48" y="89" fontSize="12">
            Um olhar sobre o território.
          </text>

          <path
            d="M165 79q27 1 43 17"
            fill="none"
            stroke="#173f36"
            strokeWidth="1.5"
          />

          <text x="352" y="247" fontSize="14" fontWeight="700">
            Argila
          </text>

          <text x="352" y="309" fontSize="14" fontWeight="700">
            Areia
          </text>

          <text x="352" y="387" fontSize="14" fontWeight="700">
            Silte
          </text>

          <text x="41" y="452" fontSize="10" letterSpacing="1.3">
            CORTE ILUSTRATIVO · SEM ESCALA
          </text>
        </g>

        <g
          className="scene-rain"
          stroke="#527f84"
          strokeWidth="3"
          strokeLinecap="round"
        >
          {Array.from({ length: 16 }, (_, index) => (
            <path
              key={index}
              d={`M${55 + index * 34} ${34 + (index % 3) * 28}l-9 20`}
            />
          ))}
        </g>

        <g className="scene-alert">
          <circle cx="454" cy="86" r="20" fill="#bb4d35" />

          <path
            d="M454 75v14m0 5v1"
            stroke="#fff7df"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <figcaption className="drawing-caption">
        <Radio size={19} />

        <span>
          <strong>O solo não segue a divisa do bairro.</strong>
          Explore as faixas de solo e as coberturas simuladas no mapa.
        </span>
      </figcaption>
    </figure>
  );
}

export default function Landing({ onLogin }) {
  const [scenario, setScenario] = useState('daily');
  const [neighborhood, setNeighborhood] = useState(clusters[0].id);
  const [role, setRole] = useState('citizen');

  const scene = SCENARIOS.find(item => item.id === scenario);
  const region = clusters.find(item => item.id === neighborhood);
  const profile = ROLES.find(item => item.id === role);
  const ProfileIcon = profile.Icon;

  return (
    <div className="landing territory-landing landing-interactive">
      <header className="public-header">
        <a className="public-brand" href="#inicio">
          <Mountain size={30} />
          <span>sentinela<small>DO SOLO</small></span>
        </a>

        <nav aria-label="Navegação do site">
          <a href="#sobre">Nossa ideia</a>
          <a href="#explorar">Explore um bairro</a>
          <a href="#perfis">Seu lugar aqui</a>
        </nav>

        <button
          className="public-button small"
          onClick={() => onLogin()}
        >
          Entrar
          <ArrowRight size={16} />
        </button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="location-stamp">
              <MapPin size={14} />
              SÃO PAULO · NORTE & NOROESTE
            </span>

            <h1>O chão<br />dá <em>sinais.</em></h1>
            <h2>O cuidado começa na nossa rua.</h2>

            <p>
              Entre a casa, a escola e o caminho de todo dia,
              tem um território que a gente compartilha.
              Conheça uma ideia para cuidar dele, juntos.
            </p>

            <div className="hero-actions">
              <a className="public-button" href="#explorar">
                Experimente o projeto
                <MoveUpRight size={19} />
              </a>

              <button
                className="public-link"
                onClick={() => onLogin('citizen')}
              >
                Entrar como cidadão
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="hero-field-note">
              <span>01 / ABRA O CADERNO</span>

              <p>
                Mude a cena ao lado.
                <br />
                <strong>O bairro é o mesmo. A informação muda.</strong>
              </p>
            </div>

            <p className="hero-note">
              <ShieldCheck size={16} />
              Projeto acadêmico FIAP · Cenários demonstrativos
            </p>
          </div>

          <div className="interactive-scene">
            <div className="scene-sticker">
              Escolha uma cena.
              <br />
              <em>Veja o que muda ↓</em>
            </div>

            <SoilDrawing scenario={scenario} />

            <div
              className="scenario-controls"
              role="group"
              aria-label="Explorar cenário ilustrativo"
            >
              {SCENARIOS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={scenario === id}
                  onClick={() => setScenario(id)}
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
            </div>

            <p className="scene-status" role="status">
              {scene.title}
            </p>
          </div>
        </section>

        <div className="field-strip">
          <span>UM RECORTE DA NOSSA CIDADE</span>

          <p>
            <strong>{clusters.length}</strong>
            bairros no cenário
          </p>

          <p>
            <strong>
              {clusters.reduce((sum, item) => sum + item.sensors, 0)}
            </strong>
            estacas ilustrativas
          </p>

          <p className="field-strip-note">
            Uma ideia feita de
            <br />
            território + gente.
          </p>
        </div>

        <section className="landing-story public-section" id="sobre">
          <div>
            <p className="section-kicker">
              A IDEIA CABE NUMA CONVERSA.
            </p>

            <h2>Antes de ser um dado,<br />é o lugar de alguém.</h2>

            <p>
              Uma estaca observa o solo. A comunidade conta o que
              percebe. Quem acompanha o território reúne essas
              informações para pensar uma resposta.
            </p>
          </div>

          <ol className="story-path">
            <li>
              <Radio size={22} />
              <span>
                <strong>Observar</strong>
                O solo entra na conversa.
              </span>
            </li>

            <li>
              <Users size={22} />
              <span>
                <strong>Compartilhar</strong>
                Quem vive perto também participa.
              </span>
            </li>

            <li>
              <ShieldCheck size={22} />
              <span>
                <strong>Cuidar</strong>
                Informação clara para cada responsabilidade.
              </span>
            </li>
          </ol>

          <p className="story-footnote">
            Neste protótipo, leituras e decisões são simuladas.
            Em situações reais, a avaliação técnica e os avisos
            oficiais continuam essenciais.
          </p>
        </section>

        <section
          className="neighborhood-lab public-section"
          id="explorar"
        >
          <div className="lab-heading">
            <div>
              <p className="section-kicker">
                02 / UM BAIRRO, TRÊS MOMENTOS
              </p>

              <h2>Traga a ideia<br />para perto de você.</h2>
            </div>

            <p>
              Escolha um bairro e troque o cenário.
              <br />
              Sem cadastro, sem termos difíceis.
            </p>
          </div>

          <div
            className="neighborhood-chips"
            role="group"
            aria-label="Escolha um bairro para o exemplo"
          >
            {clusters.map(item => (
              <button
                type="button"
                key={item.id}
                aria-pressed={neighborhood === item.id}
                onClick={() => setNeighborhood(item.id)}
              >
                <MapPin size={14} />
                {item.name}
              </button>
            ))}
          </div>

          <div className={`neighborhood-preview preview-${scenario}`}>
            <div className="neighborhood-postcard">
              <span className="postcard-stamp">
                EXEMPLO INTERATIVO
                <br />
                SÃO PAULO / SP
              </span>

              <div className="postcard-houses" aria-hidden="true">
                <span>⌂</span>
                <span>⌂</span>
                <span>⌂</span>
              </div>

              <strong>{region.name}</strong>
              <small>{region.area}</small>

              <span className="postcard-caption">
                Tem vida acontecendo aqui.
              </span>
            </div>

            <div className="neighborhood-message" aria-live="polite">
              <span className="demo-pill">
                Cenário ilustrativo · {scene.label}
              </span>

              <h3>{scene.title}</h3>
              <p>{scene.text}</p>

              <div
                className="scenario-controls compact"
                role="group"
                aria-label="Cenário do bairro"
              >
                {SCENARIOS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={scenario === id}
                    onClick={() => setScenario(id)}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>

              <button
                className="public-link"
                onClick={() => onLogin('citizen')}
              >
                {scene.action}
                <ArrowRight size={16} />
              </button>

              <small>
                Exemplo de interface. Não é previsão meteorológica
                nem aviso real.
              </small>
            </div>
          </div>
        </section>

        <section className="role-lab public-section" id="perfis">
          <div>
            <p className="section-kicker">
              03 / ONDE VOCÊ ENTRA NESSA HISTÓRIA?
            </p>

            <h2>O mesmo projeto.<br />Um olhar para cada pessoa.</h2>

            <p>
              Quem mora no bairro precisa de clareza. Quem trabalha
              no monitoramento precisa de detalhes. Cada acesso
              tem seu próprio espaço.
            </p>

            <div
              className="role-selector"
              role="group"
              aria-label="Conheça cada perfil"
            >
              {ROLES.map(({ id, label, Icon }) => (
                <button
                  type="button"
                  key={id}
                  aria-pressed={role === id}
                  onClick={() => setRole(id)}
                >
                  <Icon size={19} />
                  {label}
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          </div>

          <article
            className={`role-preview role-preview-${role}`}
            aria-live="polite"
          >
            <ProfileIcon size={35} />

            <span className="section-kicker">
              O QUE VOCÊ ENCONTRA
            </span>

            <h3>{profile.title}</h3>
            <p>{profile.text}</p>

            <ul>
              {profile.items.map(item => (
                <li key={item}>
                  <Check size={16} />
                  {item}
                </li>
              ))}
            </ul>

            <button
              className="public-button"
              onClick={() => onLogin(role)}
            >
              Entrar como {profile.label}
              <MoveUpRight size={18} />
            </button>
          </article>
        </section>

        <section className="landing-faq public-section">
          <div>
            <p className="section-kicker">ANTES DE ENTRAR</p>
            <h2>Boa pergunta.</h2>

            <p>
              Um projeto de prevenção também precisa explicar
              seus limites.
            </p>

            <span className="faq-note">
              Informação boa
              <br />
              é informação entendida.
            </span>
          </div>

          <div>
            {[
              [
                'Isso é um sistema oficial de alertas?',
                'Não. É um protótipo acadêmico da FIAP. As leituras, coberturas e decisões são demonstrativas. Em uma situação real, acompanhe a Defesa Civil e os avisos oficiais.'
              ],
              [
                'Os abrigos mostrados existem de verdade?',
                'Os pontos de abrigo do exercício são fictícios. Eles mostram como a interface funcionaria, mas não devem ser usados como destino ou rota em uma emergência.'
              ],
              [
                'Preciso criar uma conta para experimentar?',
                'Não. A demonstração tem três contas públicas de exemplo. Escolha seu perfil na tela de entrada para preencher os dados e conhecer a plataforma.'
              ]
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <span>
          <Mountain size={22} />
          Sentinela do Solo · FIAP
        </span>

        <p>
          Projeto acadêmico. Cenários e abrigos ilustrativos.
          Siga os alertas oficiais em situações reais.
        </p>

        <a className="public-link" href="#inicio">
          Voltar ao começo ↑
        </a>
      </footer>
    </div>
  );
}