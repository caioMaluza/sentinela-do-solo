import { useEffect, useState } from 'react';

import {
  AlertTriangle,
  CloudRain,
  MapPin,
  Radio,
  ShieldAlert,
  TrainFront,
  Users
} from 'lucide-react';

import { Button, Badge, Modal, SectionTitle } from '../components/UI';
import { RegionMap } from '../components/RegionMap';
import { canReturn, risk, labels } from '../lib/risk';
import { useStoredState } from '../hooks/useStoredState';

const stateOf = (region, decisions) =>
  decisions?.[region.id] || risk(region.rate);

const isRed = state =>
  state === 'critical' || state === 'evacuation';

const toneOf = state =>
  isRed(state)
    ? 'red'
    : state === 'attention'
      ? 'amber'
      : state === 'unknown'
        ? 'neutral'
        : 'green';

const number = value => Number(value).toLocaleString('pt-BR');

function OverviewCharts({ regions, company = false }) {
  const values = regions.map(region =>
    company ? region.humidity : region.families
  );

  const max = Math.max(1, ...values);

  const points = values.map((value, index) => [
    28 + index * (264 / Math.max(1, values.length - 1)),
    118 - value / max * 88
  ]);

  const line = points.map(point => point.join(',')).join(' ');
  const rain = [12, 17, 21, 36, 48, 40, 62, 80];

  return (
    <div className="chart-grid">
      <section className="card chart-card panel-padding">
        <SectionTitle title={company
          ? 'Umidade por trecho'
          : 'Famílias por área'}
        >
          <Badge tone="neutral">Ilustrativo</Badge>
        </SectionTitle>

        <svg
          viewBox="0 0 320 150"
          role="img"
          aria-label={company
            ? 'Umidade simulada por trecho, em porcentagem'
            : 'Quantidade ilustrativa de famílias nas áreas monitoradas'}
        >
          {[30, 74, 118].map(y => (
            <line
              key={y}
              x1="22"
              y1={y}
              x2="302"
              y2={y}
              stroke="currentColor"
              opacity="0.12"
            />
          ))}

          {points.length > 0 && (
            <>
              <polygon
                points={`28,118 ${line} ${points.at(-1)[0]},118`}
                fill="#d9e8f9"
              />

              <polyline
                points={line}
                fill="none"
                stroke="#4c83bc"
                strokeWidth="2.5"
              />
            </>
          )}

          {points.map(([x, y], index) => (
            <g key={regions[index].id}>
              <circle cx={x} cy={y} r="4" fill="#326ea7" />

              <text
                x={x}
                y={Math.max(13, y - 10)}
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
              >
                {number(values[index])}{company ? '%' : ''}
              </text>

              <text
                x={x}
                y="142"
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
              >
                {regions[index].sensor}
              </text>
            </g>
          ))}
        </svg>

        <p className="muted">
          {company
            ? 'Leituras fictícias das estacas da empresa.'
            : 'Distribuição fictícia das famílias nas regiões do exercício.'}
        </p>
      </section>

      <section className="card chart-card panel-padding">
        <SectionTitle title="Precipitação no cenário">
          <Badge tone="neutral">Ilustrativo</Badge>
        </SectionTitle>

        <div
          className="chart-bars"
          role="img"
          aria-label="Precipitação fictícia em oito intervalos de três horas: 12, 17, 21, 36, 48, 40, 62 e 80 milímetros"
        >
          {rain.map((value, index) => (
            <div key={index}>
              <span>{value}</span>
              <i style={{ height: `${value / 80 * 100}%` }} />
              <small>{String(index * 3).padStart(2, '0')}h</small>
            </div>
          ))}
        </div>

        <p className="muted">
          Milímetros por intervalo de 3h · série fictícia,
          sem previsão meteorológica.
        </p>
      </section>
    </div>
  );
}

function AreaTable({
  regions,
  decisions,
  cluster,
  onSelectRegion,
  company = false,
  stopped = {},
  onToggleStop
}) {
  return (
    <section className="card panel-padding">
      <SectionTitle title={company
        ? 'Trechos e estacas da empresa'
        : 'Todas as áreas monitoradas'}
      >
        <Badge tone="neutral">{regions.length} áreas</Badge>
      </SectionTitle>

      <div className="table-scroll">
        <table className="area-table">
          <caption className="sr-only">
            {company
              ? 'Apenas áreas da empresa fictícia'
              : 'Regiões acompanhadas pela Defesa Civil nesta demonstração'}
          </caption>

          <thead>
            <tr>
              <th scope="col">Área / estaca</th>
              <th scope="col">Movimento</th>
              <th scope="col">Risco simulado</th>

              {company && (
                <th scope="col">Circulação simulada</th>
              )}

              <th scope="col">Ações</th>
            </tr>
          </thead>

          <tbody>
            {regions.map(region => {
              const state = stateOf(region, decisions);

              return (
                <tr
                  key={region.id}
                  className={cluster.id === region.id
                    ? 'selected-row'
                    : ''}
                >
                  <td>
                    <strong>
                      {region.name}
                      {company && ` · km ${region.railKm}`}
                    </strong>

                    <small>
                      {region.sensors} estacas · referência {region.sensor}
                    </small>

                    <small>{region.area}</small>
                  </td>

                  <td>{number(region.rate)} °/h</td>

                  <td>
                    <Badge tone={toneOf(state)}>
                      {labels[state] || 'Leitura indisponível'}
                    </Badge>
                  </td>

                  {company && (
                    <td>
                      <Badge tone={stopped[region.id]
                        ? 'amber'
                        : 'neutral'}
                      >
                        {stopped[region.id]
                          ? 'Paralisada no exercício'
                          : 'Não paralisada no exercício'}
                      </Badge>
                    </td>
                  )}

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => onSelectRegion?.(region.id)}
                        aria-label={`Ver área ${region.name}`}
                      >
                        {cluster.id === region.id
                          ? 'Selecionada'
                          : 'Ver área'}
                      </button>

                      {company && (
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => onToggleStop(region.id)}
                          aria-label={`${
                            stopped[region.id] ? 'Retomar' : 'Paralisar'
                          } circulação simulada em ${region.name}`}
                        >
                          {stopped[region.id]
                            ? 'Simular retomada'
                            : 'Simular paralisação'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CivilDecision({ cluster, decision, onDecision }) {
  const [step, setStep] = useState(0);
  const [inspected, setInspected] = useState(false);
  const [stable, setStable] = useState(false);

  const returnAllowed = decision === 'evacuation'
    && canReturn(stable ? 0 : cluster.rate, inspected);

  useEffect(() => {
    setStep(0);
    setInspected(false);
    setStable(false);
  }, [cluster.id, decision]);

  return (
    <section className="card panel-padding decision-controls">
      <SectionTitle title="Decisão operacional">
        <ShieldAlert size={20} />
      </SectionTitle>

      <p className="current-area">
        <MapPin size={16} />
        {cluster.name}
      </p>

      <p className="muted">
        Exercício local. A confirmação altera o cenário do cidadão
        neste navegador; nenhum alerta público é enviado.
      </p>

      <Button
        variant="danger"
        onClick={() => setStep(1)}
        disabled={decision === 'evacuation'}
      >
        <AlertTriangle size={17} />

        {decision === 'evacuation'
          ? 'Evacuação simulada ativa'
          : 'Simular alerta vermelho'}
      </Button>

      <div className="return-controls">
        <h3>Retorno após vistoria simulada</h3>

        <label className="check-item">
          <input
            type="checkbox"
            checked={stable}
            onChange={event => setStable(event.target.checked)}
          />

          <span>Simular leitura estabilizada: 0 °/h</span>
        </label>

        <label className="check-item">
          <input
            type="checkbox"
            checked={inspected}
            onChange={event => setInspected(event.target.checked)}
          />

          <span>Registrar vistoria técnica no exercício</span>
        </label>

        <Button
          variant="secondary"
          disabled={!returnAllowed}
          onClick={() => onDecision('returned')}
        >
          Liberar retorno simulado
        </Button>

        <small className="muted">
          Exige evacuação simulada anterior, leitura zero e vistoria.
          As condições são reiniciadas ao mudar de área ou de decisão.
        </small>
      </div>

      {step > 0 && (
        <Modal
          title={step === 1
            ? '1 de 2 · Revisar alerta simulado'
            : '2 de 2 · Confirmar exercício'}
          onClose={() => setStep(0)}
        >
          <p>
            {step === 1
              ? `Área: ${cluster.name}. Estaca: ${cluster.sensor}. Leitura fictícia: ${number(cluster.rate)} °/h. Deseja simular uma evacuação preventiva nesta região?`
              : 'O painel do cidadão exibirá um alerta vermelho e abrigos ilustrativos. Este exercício não emite ordem de evacuação nem aviso real.'}
          </p>

          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={() => setStep(0)}
            >
              Cancelar
            </Button>

            <Button
              variant="danger"
              onClick={() => {
                if (step === 1) {
                  setStep(2);
                } else {
                  onDecision('evacuation');
                  setStep(0);
                }
              }}
            >
              {step === 1
                ? 'Revisar confirmação'
                : 'Confirmar evacuação simulada'}
            </Button>
          </div>
        </Modal>
      )}
    </section>
  );
}

export function CivilPanel({
  cluster,
  decision,
  onDecision,
  regions = [],
  decisions = {},
  onSelectRegion
}) {
  const selectedState = decision || stateOf(cluster, decisions);

  const alerts = regions.filter(
    region => isRed(stateOf(region, decisions))
  );

  const families = regions.reduce(
    (total, region) => total + region.families,
    0
  );

  return (
    <div className="operations civil-operations">
      <div className="operational-stats">
        <div className="card stat-pair">
          <MapPin size={20} />
          <span>
            Áreas monitoradas
            <strong>{regions.length}</strong>
          </span>
        </div>

        <div className="card stat-pair">
          <Radio size={20} />
          <span>
            Estacas no cenário
            <strong>
              {regions.reduce((sum, region) => sum + region.sensors, 0)}
            </strong>
          </span>
        </div>

        <div className="card stat-pair">
          <Users size={20} />
          <span>
            Famílias ilustrativas
            <strong>{number(families)}</strong>
          </span>
        </div>

        <div className="card stat-pair">
          <AlertTriangle size={20} />
          <span>
            Áreas em vermelho
            <strong>{alerts.length}</strong>
          </span>
        </div>
      </div>

      <div className="ops-grid">
        <div className="ops-main">
          <RegionMap
            cluster={cluster}
            regions={regions}
            decisions={decisions}
            overview
            expanded
            onSelectRegion={onSelectRegion}
            title="Monitoramento territorial"
          />

          <OverviewCharts regions={regions} />
        </div>

        <aside
          className="ops-aside"
          aria-label="Riscos e decisões da Defesa Civil"
        >
          <section className="card panel-padding risk-summary">
            <SectionTitle title="Risco geológico">
              <Badge tone="neutral">Simulado</Badge>
            </SectionTitle>

            <Badge tone={toneOf(selectedState)}>
              {selectedState === 'evacuation'
                ? 'Alerta vermelho'
                : selectedState === 'critical'
                  ? 'Alto'
                  : selectedState === 'attention'
                    ? 'Médio'
                    : selectedState === 'unknown'
                      ? 'Indisponível'
                      : 'Baixo'}
            </Badge>

            <p>{cluster.name} · {cluster.sensor}</p>

            <div className="summary-rain">
              <CloudRain size={22} />

              <span>
                Precipitação no cenário
                <strong>80 <small>mm / 3h</small></strong>
              </span>
            </div>

            <small className="muted">
              Valor fictício do último intervalo do gráfico.
            </small>

            <div className="summary-alerts">
              <strong>{alerts.length}</strong>
              <span>áreas em vermelho no cenário</span>
            </div>
          </section>

          <section className="card panel-padding">
            <SectionTitle title="Alertas por área">
              <Badge tone="red">{alerts.length}</Badge>
            </SectionTitle>

            <div className="alert-list">
              {alerts.length === 0 ? (
                <p className="muted">
                  Nenhuma área em vermelho no exercício.
                </p>
              ) : (
                alerts.map(region => (
                  <button
                    type="button"
                    key={region.id}
                    onClick={() => onSelectRegion?.(region.id)}
                  >
                    <AlertTriangle size={17} />

                    <span>
                      <strong>{region.name}</strong>
                      <small>
                        {labels[stateOf(region, decisions)]}
                      </small>
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>

          <CivilDecision
            key={cluster.id}
            cluster={cluster}
            decision={decision}
            onDecision={onDecision}
          />
        </aside>
      </div>

      <AreaTable
        regions={regions}
        decisions={decisions}
        cluster={cluster}
        onSelectRegion={onSelectRegion}
      />
    </div>
  );
}

export function CompanyPanel({
  cluster,
  regions = [],
  decisions = {},
  onSelectRegion
}) {
  const [storedStops, setStopped] = useStoredState(
    'sentinela-company-stops-via-serra',
    {}
  );

  const stopped = Object.fromEntries(
    regions.map(region => [
      region.id,
      Boolean(
        storedStops
        && typeof storedStops === 'object'
        && !Array.isArray(storedStops)
        && storedStops[region.id] === true
      )
    ])
  );

  const stoppedCount = regions.filter(
    region => stopped[region.id] === true
  ).length;

  const alerts = regions.filter(
    region => isRed(stateOf(region, decisions))
  ).length;

  function toggleStop(id) {
    if (!regions.some(region => region.id === id)) return;

    setStopped(previous => {
      const current = (
        previous
        && typeof previous === 'object'
        && !Array.isArray(previous)
      ) ? previous : {};

      return {
        ...current,
        [id]: current[id] !== true
      };
    });
  }

  return (
    <div className="operations company-operations">
      <div className="operational-stats">
        <div className="card stat-pair">
          <TrainFront size={20} />
          <span>
            Trechos próprios
            <strong>{regions.length}</strong>
          </span>
        </div>

        <div className="card stat-pair">
          <Radio size={20} />
          <span>
            Estacas da empresa
            <strong>
              {regions.reduce((sum, region) => sum + region.sensors, 0)}
            </strong>
          </span>
        </div>

        <div className="card stat-pair">
          <AlertTriangle size={20} />
          <span>
            Áreas em vermelho
            <strong>{alerts}</strong>
          </span>
        </div>

        <div className="card stat-pair">
          <TrainFront size={20} />
          <span>
            Trechos paralisados no exercício
            <strong>{stoppedCount}</strong>
          </span>
        </div>
      </div>

      <div className="ops-grid">
        <div className="ops-main">
          <RegionMap
            cluster={cluster}
            regions={regions}
            decisions={decisions}
            overview
            expanded
            onSelectRegion={onSelectRegion}
            title="Mapa dos ativos da empresa"
          />

          <OverviewCharts regions={regions} company />
        </div>

        <aside
          className="ops-aside"
          aria-label="Operação ferroviária simulada"
        >
          <section className="card panel-padding risk-summary">
            <SectionTitle title="Operação ferroviária">
              <Badge tone="neutral">Empresa fictícia</Badge>
            </SectionTitle>

            <TrainFront size={32} />
            <h3>Via Serra</h3>

            <p className="muted">
              Visão dos trechos vinculados à empresa
              e de suas estacas demonstrativas.
            </p>

            <div className="summary-alerts">
              <strong>
                {regions.length - stoppedCount}/{regions.length}
              </strong>

              <span>trechos sem paralisação no exercício</span>
            </div>
          </section>

          <section className="card panel-padding decision-controls">
            <SectionTitle title="Trecho selecionado" />

            <p className="current-area">
              <MapPin size={16} />
              {cluster.name}
            </p>

            <p className="muted">
              km {cluster.railKm} · {cluster.sensors} estacas ·
              referência {cluster.sensor} · {number(cluster.rate)} °/h
            </p>

            <Badge tone={toneOf(stateOf(cluster, decisions))}>
              {labels[stateOf(cluster, decisions)]}
            </Badge>

            <Button
              variant={stopped[cluster.id] ? 'secondary' : 'danger'}
              onClick={() => toggleStop(cluster.id)}
            >
              {stopped[cluster.id]
                ? 'Simular retomada da circulação'
                : 'Simular paralisação da circulação'}
            </Button>

            <p className="muted" role="status">
              {stopped[cluster.id]
                ? 'Circulação paralisada apenas neste exercício.'
                : 'Circulação não paralisada neste exercício; este estado não certifica a segurança do trecho.'}
            </p>
          </section>

          <section className="card panel-padding">
            <SectionTitle title="Escopo empresarial" />

            <p className="muted">
              Os comandos simulam somente a circulação nos próprios
              trechos. Alertas e evacuações públicas pertencem ao
              painel da Defesa Civil.
            </p>
          </section>
        </aside>
      </div>

      <AreaTable
        regions={regions}
        decisions={decisions}
        cluster={cluster}
        onSelectRegion={onSelectRegion}
        company
        stopped={stopped}
        onToggleStop={toggleStop}
      />
    </div>
  );
}