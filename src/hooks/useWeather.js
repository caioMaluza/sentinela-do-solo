import {
  useEffect,
  useState
} from 'react';

export function useWeather(cluster) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setWeather(null);
    setError('');

    // ==================================================
    // CONSULTA À API OPEN-METEO
    // ==================================================

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${cluster.lat}` +
      `&longitude=${cluster.lon}` +
      `&current=temperature_2m,precipitation` +
      `&hourly=precipitation_probability` +
      `&forecast_days=1` +
      `&timezone=America%2FSao_Paulo`;

    fetch(url, {
      signal: AbortSignal.any([
        controller.signal,
        AbortSignal.timeout(15000)
      ])
    })
      .then(response => {
        if (!response.ok) {
          throw Error();
        }

        return response.json();
      })

      .then(data => {
        if (active) setWeather(data.current || null);
      })

      .catch(error => {
        if (active && error.name !== 'AbortError') {
          setError(
            'Clima indisponível no momento'
          );
        }
      });

    return () => { active = false; controller.abort(); };
  }, [cluster.id]);

  return {
    weather,
    error
  };
}
