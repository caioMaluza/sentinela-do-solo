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
            ? 'Tudo tranquilo por aqui.'
            : state === 'evacuation'
              ? 'Simulação: siga para um local seguro.'
              : state === 'returned'
                ? 'Vistoria concluída na simulação.'
                : 'Vamos nos preparar, com calma.'}
        </h2>

        <p>
          {state === 'stable'
            ? 'Os indicadores demonstrativos estão estáveis. Continue acompanhando sua região.'
            : state === 'evacuation'
              ? 'Evacuação autorizada no exercício acadêmico. Consulte o mapa demonstrativo.'
              : state === 'returned'
                ? 'O movimento foi estabilizado e a vistoria registrada neste exercício.'
                : 'O solo da sua região merece atenção. Organize o essencial e acompanhe as atualizações.'}
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
