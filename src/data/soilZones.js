import { clusters } from './clusters.js';

// Malha didática, sem origem em sondagens ou API.
// Não é um mapa pedológico nem uma previsão de deslizamentos.

export const SOIL_TYPES = {
  clay: {
    label: 'Solo argiloso',
    color: '#c9784d',
    description:
      'Exemplo de material com partículas finas e maior retenção de água. A classificação por si só não determina o risco.'
  },
  sand: {
    label: 'Solo arenoso',
    color: '#dfbd55',
    description:
      'Exemplo de material com partículas mais grossas. Drenagem e estabilidade dependem das condições locais.'
  },
  silt: {
    label: 'Solo siltoso',
    color: '#64a58b',
    description:
      'Exemplo de material de granulometria intermediária. São necessários estudos locais para caracterizar seu comportamento.'
  }
};

// Coordenadas: [latitude, longitude].
// Vértices compartilhados mantêm as zonas contíguas.

const northEdge = [
  [-23.428, -46.800],
  [-23.435, -46.773],
  [-23.426, -46.750],
  [-23.437, -46.723],
  [-23.431, -46.700],
  [-23.438, -46.670],
  [-23.430, -46.640]
];

const southEdge = [
  [-23.492, -46.800],
  [-23.486, -46.768],
  [-23.496, -46.745],
  [-23.486, -46.719],
  [-23.482, -46.700],
  [-23.487, -46.680],
  [-23.479, -46.640]
];

const divider = [
  northEdge[3],
  [-23.450, -46.713],
  [-23.462, -46.721],
  [-23.475, -46.710],
  southEdge[3]
];

const definitions = [
  {
    id: 'solo-perus',
    name: 'Faixa de Perus',
    soilType: 'silt',
    positions: [
      [-23.390, -46.800],
      [-23.390, -46.640],
      ...[...northEdge].reverse()
    ],
    sensorId: 'EST-004',
    sensorIds: ['EST-004']
  },
  {
    id: 'solo-jaragua-pirituba',
    name: 'Faixa Jaraguá–Pirituba',
    soilType: 'sand',
    positions: [
      ...northEdge.slice(0, 4),
      ...divider.slice(1),
      ...southEdge.slice(0, 3).reverse()
    ],
    sensorId: 'EST-002',
    sensorIds: ['EST-002', 'EST-005']
  },
  {
    id: 'solo-brasilandia-cachoeirinha',
    name: 'Faixa Brasilândia–Cachoeirinha',
    soilType: 'clay',
    positions: [
      ...northEdge.slice(3),
      ...southEdge.slice(3).reverse(),
      ...divider.slice(1, -1).reverse()
    ],
    sensorId: 'EST-001',
    sensorIds: ['EST-001', 'EST-003']
  },
  {
    id: 'solo-freguesia',
    name: 'Faixa da Freguesia do Ó',
    soilType: 'clay',
    positions: [
      ...southEdge,
      [-23.510, -46.640],
      [-23.510, -46.800]
    ],
    sensorId: 'EST-006',
    sensorIds: ['EST-006']
  }
];

export function coversPoint(zone, point) {
  const lat = Array.isArray(point) ? point[0] : point?.lat;
  const lon = Array.isArray(point) ? point[1] : point?.lon;
  const ring = zone?.positions;

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    !Array.isArray(ring) ||
    ring.length < 3
  ) {
    return false;
  }

  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [yi, xi] = ring[i];
    const [yj, xj] = ring[j];

    const cross = (lon - xi) * (yj - yi)
      - (lat - yi) * (xj - xi);

    const onEdge =
      Math.abs(cross) < 1e-10 &&
      lon >= Math.min(xi, xj) - 1e-10 &&
      lon <= Math.max(xi, xj) + 1e-10 &&
      lat >= Math.min(yi, yj) - 1e-10 &&
      lat <= Math.max(yi, yj) + 1e-10;

    if (onEdge) return true;

    if (
      (yi > lat) !== (yj > lat) &&
      lon < (xj - xi) * (lat - yi) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }

  return inside;
}

export const soilZones = definitions.map(zone => ({
  ...zone,
  clusterIds: clusters
    .filter(cluster => coversPoint(zone, cluster))
    .map(cluster => cluster.id),
  note:
    'Solo e cobertura ilustrativos. O tracejado demonstra uma associação entre estacas e uma faixa de solo; não certifica alcance nem prevê riscos em bairros vizinhos.'
}));

export function getCoverageForSensor(sensorId) {
  return soilZones.filter(zone => zone.sensorIds.includes(sensorId));
}

export function getZonesForCluster(clusterId) {
  return soilZones.filter(zone => zone.clusterIds.includes(clusterId));
}