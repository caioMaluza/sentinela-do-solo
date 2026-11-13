// Áreas, estacas e leituras fictícias para a demonstração acadêmica.
// Via Serra é uma empresa ferroviária fictícia.

export const clusters = [
  {
    id: 'brasilandia',
    name: 'Brasilândia',
    area: 'Zona Norte · São Paulo',
    lat: -23.448,
    lon: -46.69,
    rate: 0.045,
    humidity: 78,
    families: 128,
    soil: 'Solo residual argiloso',
    sensor: 'EST-001',
    sensors: 12,
    precipitation: 62,
    companyId: null,
    railKm: null
  },

  {
    id: 'jaragua',
    name: 'Jaraguá',
    area: 'Zona Noroeste · São Paulo',
    lat: -23.456,
    lon: -46.735,
    rate: 0.018,
    humidity: 54,
    families: 96,
    soil: 'Solo residual arenoso',
    sensor: 'EST-002',
    sensors: 8,
    precipitation: 24,
    companyId: 'via-serra',
    railKm: '18–24'
  },

  {
    id: 'mboi',
    name: 'M’Boi Mirim',
    area: 'Zona Sul · São Paulo',
    lat: -23.681,
    lon: -46.773,
    rate: 0.105,
    humidity: 91,
    families: 164,
    soil: 'Solo residual argiloso',
    sensor: 'EST-003',
    sensors: 16,
    precipitation: 86,
    companyId: null,
    railKm: null
  },

  {
    id: 'perus',
    name: 'Perus',
    area: 'Zona Noroeste · São Paulo',
    lat: -23.405,
    lon: -46.752,
    rate: 0.067,
    humidity: 83,
    families: 72,
    soil: 'Solo residual argiloso',
    sensor: 'EST-004',
    sensors: 10,
    precipitation: 71,
    companyId: 'via-serra',
    railKm: '25–31'
  },

  {
    id: 'franco',
    name: 'Franco da Rocha',
    area: 'Região Metropolitana · SP',
    lat: -23.329,
    lon: -46.727,
    rate: 0.112,
    humidity: 94,
    families: 118,
    soil: 'Solo residual siltoso',
    sensor: 'EST-005',
    sensors: 14,
    precipitation: 93,
    companyId: 'via-serra',
    railKm: '32–39'
  },

  {
    id: 'itaquera',
    name: 'Itaquera',
    area: 'Zona Leste · São Paulo',
    lat: -23.539,
    lon: -46.454,
    rate: 0.023,
    humidity: 59,
    families: 84,
    soil: 'Solo residual arenoso',
    sensor: 'EST-006',
    sensors: 9,
    precipitation: 31,
    companyId: null,
    railKm: null
  }
];

// Checklist pessoal: disponível somente para o cidadão.
export const checklist = [
  'Separe documentos em um saco plástico',
  'Deixe remédios e itens essenciais à mão',
  'Prepare água e uma troca de roupa',
  'Combine um ponto de encontro com a família',
  'Organize o transporte dos seus pets'
];