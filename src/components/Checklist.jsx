import { checklist } from '../data/clusters';
import { useStoredState } from '../hooks/useStoredState';
import { SectionTitle, Badge } from './UI';

export function Checklist() {
  const [checked, setChecked] = useStoredState(
    'sentinela-checklist',
    []
  );

  return (
    <section className="card checklist">
      <SectionTitle
        eyebrow="PEQUENOS CUIDADOS, MAIS TRANQUILIDADE"
        title="Sua preparação começa aqui"
      >
        <Badge>
          {checked.length}/{checklist.length}
        </Badge>
      </SectionTitle>

      <div className="progress">
        <i
          style={{
            width: (checked.length / checklist.length) * 100 + '%'
          }}
        />
      </div>

      {checklist.map((item, i) => (
        <label className="check-item" key={item}>
          <input
            type="checkbox"
            checked={checked.includes(i)}
            onChange={() =>
              setChecked(
                checked.includes(i)
                  ? checked.filter(x => x !== i)
                  : [...checked, i]
              )
            }
          />

          <span>{item}</span>
        </label>
      ))}

      <p className="muted">
        Checklist pessoal salvo neste aparelho.
      </p>
    </section>
  );
}
