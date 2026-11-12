import { useEffect, useState } from 'react';

export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) ?? initial);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* Navegação privada ou armazenamento cheio: manter em memória. */ }
  }, [key, value]);

  return [value, setValue];
}
