// ==================================================
// CLASSIFICAÇÃO DO RISCO
// ==================================================

export function risk(rate, critical = 0.1) {
  if (!Number.isFinite(rate) || rate < 0 || !Number.isFinite(critical) || critical <= 0) {
    return 'unknown';
  }

  return rate >= critical
    ? 'critical'
    : rate + Number.EPSILON >= critical * 0.4
      ? 'attention'
      : 'stable';
}

// ==================================================
// VERIFICAÇÃO DE RETORNO
// ==================================================

export const canReturn = (rate, inspected) =>
  rate === 0 && inspected;

// ==================================================
// TEXTOS DOS STATUS
// ==================================================

export const labels = {
  stable: 'Solo estável',
  attention: 'Atenção ao solo',
  critical: 'Análise prioritária',
  evacuation: 'Evacuação simulada',
  returned: 'Retorno autorizado na simulação',
  unknown: 'Leitura indisponível'
};

// ==================================================
// CÁLCULO DE DISTÂNCIA GEOGRÁFICA
// ==================================================

export function distance(a, b) {
  const radians = n => n * Math.PI / 180;

  const h =
    Math.sin(
      radians(b.lat - a.lat) / 2
    ) ** 2 +

    Math.cos(radians(a.lat)) *
    Math.cos(radians(b.lat)) *

    Math.sin(
      radians(b.lon - a.lon) / 2
    ) ** 2;

  return (
    6371000 *
    2 *
    Math.asin(Math.sqrt(Math.min(1, Math.max(0, h))))
  );
}
