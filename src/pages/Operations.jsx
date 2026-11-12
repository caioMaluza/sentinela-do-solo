import { useState } from 'react';

import {
  Button,
  Badge,
  Modal,
  SectionTitle
} from '../components/UI';

import {
  canReturn,
  risk,
  labels
} from '../lib/risk';

import { clusters } from '../data/clusters';

// ==================================================
// PAINEL DA DEFESA CIVIL
// ==================================================

export function CivilPanel({
  cluster,
  decision,
  onDecision
}) {
  const [step, setStep] = useState(0);
  const [inspected, setInspected] = useState(false);
  const [stable, setStable] = useState(false);

  return (
    <section className="card p-6">
      <SectionTitle
        eyebrow="DECISÃO HUMANA"
        title="Central da Defesa Civil"
      >
        <Badge tone="amber">
          Simulador
        </Badge>
      </SectionTitle>

      <div className="cluster-grid">
        {clusters.map(c => (
          <div className="cluster-item" key={c.id}>
            <strong>{c.name}</strong>

            <p>
              {c.sensor} · {c.rate} °/h
            </p>

            <Badge
              tone={
                risk(c.rate) === 'stable'
                  ? 'green'
                  : 'amber'
              }
            >
              {labels[risk(c.rate)]}
            </Badge>
          </div>
        ))}
      </div>

      <p className="muted my-4">
        Área selecionada: {cluster.name}.
        As ações abaixo são exercícios e não
        emitem alertas públicos.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="danger"
          onClick={() => setStep(1)}
        >
          Simular evacuação preventiva
        </Button>

        <Button
          variant="secondary"
          disabled={
            !canReturn(
              stable ? 0 : cluster.rate,
              inspected
            ) ||
            decision !== 'evacuation'
          }
          onClick={() => onDecision('returned')}
        >
          Liberar retorno simulado
        </Button>
      </div>

      <label className="check-item">
        <input
          type="checkbox"
          checked={stable}
          onChange={e => setStable(e.target.checked)}
        />

        Simular leitura estabilizada: dθ/dt = 0
      </label>

      <label className="check-item">
        <input
          type="checkbox"
          checked={inspected}
          onChange={e => setInspected(e.target.checked)}
        />

        Registrar vistoria concluída neste exercício
      </label>

      <small className="muted">
        O retorno exige evacuação anterior,
        leitura estabilizada e vistoria.
      </small>

      {step > 0 && (
        <Modal
          title={
            step === 1
              ? '1 de 2 · Revisar a decisão'
              : '2 de 2 · Confirmar simulação'
          }
          onClose={() => setStep(0)}
        >
          <p className="my-5">
            {step === 1
              ? 'Você revisou os indicadores de ' +
                cluster.name +
                ' e deseja simular a evacuação?'
              : 'A confirmação mudará o painel do cidadão neste navegador. Nenhum aviso real será enviado.'}
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

// ==================================================
// PAINEL EMPRESARIAL
// ==================================================

export function CompanyPanel() {
  const [stopped, setStopped] = useState({});

  return (
    <section className="card p-6">
      <SectionTitle
        eyebrow="OPERAÇÃO & IMPACTO"
        title="Cuidar do território é cuidar de todos"
      >
        <Badge>ESG</Badge>
      </SectionTitle>

      <p className="muted my-4">
        Ativos e indicadores fictícios para
        demonstração acadêmica.
      </p>

      <div className="cluster-grid">
        {clusters.map(c => (
          <div className="cluster-item" key={c.id}>
            <strong>
              Talude · {c.name}
            </strong>

            <p>
              {c.sensor} · {c.families} famílias no cenário
            </p>

            <Badge
              tone={
                stopped[c.id]
                  ? 'amber'
                  : 'green'
              }
            >
              {stopped[c.id]
                ? 'Circulação paralisada'
                : 'Operação normal'}
            </Badge>

            <Button
              variant="secondary"
              onClick={() =>
                setStopped({
                  ...stopped,
                  [c.id]: !stopped[c.id]
                })
              }
            >
              {stopped[c.id]
                ? 'Retomar simulação'
                : 'Paralisar circulação'}
            </Button>
          </div>
        ))}
      </div>

      <p className="muted mt-5">
        Os dados são compartilhados com a Defesa Civil.
        A empresa atua somente sobre sua operação;
        a decisão de evacuação é do agente público.
      </p>
    </section>
  );
}
