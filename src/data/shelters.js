import { distance } from '../lib/risk.js';

// Pontos inventados ao redor do centro de cada região.
// Não representam abrigos existentes ou locais avaliados como seguros.

const shelterTemplates = [
  {
    suffix: 'comunitario',
    name: 'Centro Comunitário Modelo',
    latOffset: 0.008,
    lonOffset: 0.004,
    capacity: 120,
    accessibility: 'Acesso acessível no cenário'
  },

  {
    suffix: 'escola',
    name: 'Escola de Acolhimento Exemplo',
    latOffset: -0.006,
    lonOffset: -0.009,
    capacity: 180,
    accessibility: 'Acesso acessível no cenário'
  },

  {
    suffix: 'ginasio',
    name: 'Ginásio de Apoio Modelo',
    latOffset: 0.014,
    lonOffset: -0.012,
    capacity: 240,
    accessibility: 'Acessibilidade a verificar no exercício'
  }
];

export function getNearbyShelters(cluster) {
  if (
    !cluster
    || !Number.isFinite(cluster.lat)
    || !Number.isFinite(cluster.lon)
  ) {
    return [];
  }

  return shelterTemplates
    .map(({ latOffset, lonOffset, suffix, ...shelter }) => {
      const point = {
        lat: cluster.lat + latOffset,
        lon: cluster.lon + lonOffset
      };

      return {
        ...shelter,
        ...point,
        id: `${cluster.id}-${suffix}`,
        name: `${shelter.name} · ilustrativo`,
        distanceMeters: Math.round(distance(cluster, point))
      };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}