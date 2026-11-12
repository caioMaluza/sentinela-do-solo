import {
  useState,
  useEffect
} from 'react';

export function useStoredState(key, initial) {
  // ==================================================
  // RECUPERAR DADOS DO LOCALSTORAGE
  // ==================================================

  const [value, setValue] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(key)) ??
        initial
      );
    } catch {
      return initial;
    }
  });

  // ==================================================
  // SALVAR ALTERAÇÕES
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }, [key, value]);

  return [value, setValue];
}
