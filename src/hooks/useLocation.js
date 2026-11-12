import { useState } from 'react';

export function useLocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function locate() {
    if (!navigator.geolocation) {
      setError(
        'Localização não disponível. Use a região selecionada.'
      );

      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      // Localização obtida com sucesso
      position => {
        setPosition({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });

        setLoading(false);
        setError('');
      },

      // Falha na localização
      () => {
        setError(
          'Não foi possível acessar o GPS. Use a região selecionada.'
        );

        setLoading(false);
      },

      // Configurações
      {
        timeout: 10000
      }
    );
  }

  return {
    position,
    error,
    loading,
    locate
  };
}
