import {
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

import { Button, Badge } from './UI';
import { labels } from '../lib/risk';

export function StatusBanner({
  state,
  cluster,
  onPrepare
}) {
  return (
    <section className={'status-banner ' + state}>
      <div className="status-art">
        <ShieldCheck
          size={60}
          strokeWidth={1.2}
        />
      </div>

      <div className="status-copy">
        <Badge tone={state === 'stable' ? 'green' : 'amber'}>
          <span className="dot" />
          {labels[state]}
        </Badge>

        <h2>
          {state === 'stable'
            ? 'Cenário com leitura estável.'
            : state === 'evacuation'
              ? 'Simulação: siga para um local seguro.'
              : state === 'returned'
                ? 'Vistoria concluída na simulação.'
                : 'Vamos nos preparar, com calma.'}
        </h2>

        <p>
          {state === 'stable'
            ? 'Esta é uma leitura simulada, não uma avaliação da segurança real da encosta.'
            : state === 'evacuation'
              ? 'Evacuação simulada; nenhuma ordem real foi emitida. Não utilize o mapa para sair de casa.'
              : state === 'returned'
                ? 'Este retorno foi autorizado somente na simulação, sem vistoria real.'
                : 'O cenário ilustrativo indica atenção. Para situações reais, acompanhe avisos oficiais.'}
        </p>

        <Button
          variant="light"
          onClick={onPrepare}
        >
          Ver orientações
          <ArrowRight size={16} />
        </Button>
      </div>

      <span className="banner-region">
        {cluster.name} · Dados simulados
      </span>
    </section>
  );
}
