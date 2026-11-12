import {
  useState,
  useEffect
} from 'react';

import { reportsApi } from '../services/api';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // ==================================================
  // CARREGAR RELATOS
  // ==================================================

  async function refresh() {
    setLoading(true);

    try {
      setReports(await reportsApi.list());
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  // ==================================================
  // EXECUTAR ALTERAÇÕES
  // ==================================================

  async function mutate(action) {
    setBusy(true);
    setError('');

    try {
      await action();
      await refresh();

      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  // ==================================================
  // FUNÇÕES DISPONÍVEIS
  // ==================================================

  return {
    reports,
    loading,
    error,
    busy,
    refresh,

    save: (data, id) =>
      mutate(() =>
        id
          ? reportsApi.update(id, data)
          : reportsApi.create(data)
      ),

    remove: id =>
      mutate(() => reportsApi.remove(id))
  };
}
