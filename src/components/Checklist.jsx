import { checklist } from '../data/clusters';
import { useStoredState } from '../hooks/useStoredState';
import { SectionTitle, Badge } from './UI';

export function Checklist() {
  const [checked, setChecked] = useStoredState(
    'sentinela-checklist',
    []
  );

  const selected = Array.isArray(checked) ? checked.filter(x => Number.isInteger(x) && x >= 0 && x < checklist.length) : [];

  return (
    <section className="card checklist">
      <SectionTitle
        eyebrow="PEQUENOS CUIDADOS, MAIS TRANQUILIDADE"
        title="Sua preparação começa aqui"
      >
        <Badge>
          {selected.length}/{checklist.length}
        </Badge>
      </SectionTitle>

      <div className="progress">
        <i
          style={{
            width: (selected.length / checklist.length) * 100 + '%'
          }}
        />
      </div>

      {checklist.map((item, i) => (
        <label className="check-item" key={item}>
          <input
            type="checkbox"
            checked={selected.includes(i)}
            onChange={() =>
              setChecked(previous => {
                const current = Array.isArray(previous) ? previous : [];
                return current.includes(i)
                  ? current.filter(x => x !== i)
                  : [...current, i];
              })
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
