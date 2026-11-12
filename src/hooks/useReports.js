import { useCallback, useEffect, useState } from 'react';
import { reportsApi } from '../services/api';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [adminKey, setKey] = useState(() => {
    try { return sessionStorage.getItem('sentinela-admin-key') || ''; }
    catch { return ''; }
  });

  const setAdminKey = useCallback(value => {
    const key = String(value || '').trim();
    setKey(key);
    try {
      if (key) sessionStorage.setItem('sentinela-admin-key', key);
      else sessionStorage.removeItem('sentinela-admin-key');
    } catch { /* O navegador pode bloquear o armazenamento da sessão. */ }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportsApi.list();
      if (!Array.isArray(data)) throw new Error('A lista de relatos está inválida.');
      setReports(data);
      setError('');
      return true;
    } catch (exception) {
      setError(exception.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const mutate = async action => {
    if (busy) return false;
    setBusy(true);
    setError('');
    try {
      await action();
      await refresh();
      return true;
    } catch (exception) {
      setError(exception.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  return {
    reports, loading, busy, error, refresh, adminKey, setAdminKey,
    save: (data, id) => mutate(() => id
      ? reportsApi.update(id, data, adminKey)
      : reportsApi.create(data)),
    remove: id => mutate(() => reportsApi.remove(id, adminKey))
  };
}
