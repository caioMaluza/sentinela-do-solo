import {
  ShieldCheck,
  TriangleAlert,
  ArrowRight
} from 'lucide-react';

import { Button, Badge } from './UI';
import { labels } from '../lib/risk';

export function StatusBanner({ state, cluster, onPrepare }) {
  const red = state === 'critical' || state === 'evacuation';
  const green = state === 'stable' || state === 'returned';
  const Icon = red ? TriangleAlert : ShieldCheck;

  return (
    <section
      className={`status-banner ${state}`}
      aria-live="polite"
    >
      <div className="status-art">
        <Icon size={38} strokeWidth={1.5} />
      </div>

      <div className="status-copy">
        <Badge tone={red ? 'red' : green ? 'green' : 'amber'}>
          {red
            ? 'ALERTA VERMELHO · SIMULAÇÃO'
            : labels[state]}
        </Badge>

        <h2>
          {red
            ? 'Exercício de alerta na sua região.'
            : state === 'returned'
              ? 'Retorno autorizado no exercício.'
              : green
                ? 'Acompanhe sua região com tranquilidade.'
                : 'Atenção começa com informação.'}
        </h2>

        <p>
          {red
            ? `O cenário de ${cluster.name} foi marcado como crítico. Os abrigos abaixo são fictícios e servem apenas para conhecer a experiência do projeto.`
            : state === 'returned'
              ? 'A Defesa Civil concluiu a vistoria e liberou o retorno apenas nesta simulação.'
              : 'As leituras das estacas são simuladas. Acompanhe os avisos oficiais para decisões em situações reais.'}
        </p>

        <Button variant="light" onClick={onPrepare}>
          Ver minha preparação
          <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  );
}