// Recorte de bairros/distritos das zonas Norte e Noroeste de São Paulo.
// Centros aproximados; solos, estacas e leituras são ilustrativos.
// Os pontos não representam limites administrativos oficiais.

export const clusters = [
  {
    id: 'brasilandia',
    name: 'Brasilândia',
    area: 'Zona Norte · São Paulo',
    city: 'São Paulo',
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
    city: 'São Paulo',
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
    id: 'cachoeirinha',
    name: 'Vila Nova Cachoeirinha',
    area: 'Zona Norte · São Paulo',
    city: 'São Paulo',
    lat: -23.460,
    lon: -46.664,
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
    city: 'São Paulo',
    lat: -23.405,
    lon: -46.752,
    rate: 0.067,
    humidity: 83,
    families: 72,
    soil: 'Solo residual siltoso',
    sensor: 'EST-004',
    sensors: 10,
    precipitation: 71,
    companyId: 'via-serra',
    railKm: '25–31'
  },
  {
    id: 'pirituba',
    name: 'Pirituba',
    area: 'Zona Noroeste · São Paulo',
    city: 'São Paulo',
    lat: -23.483,
    lon: -46.726,
    rate: 0.112,
    humidity: 94,
    families: 118,
    soil: 'Solo residual arenoso',
    sensor: 'EST-005',
    sensors: 14,
    precipitation: 93,
    companyId: 'via-serra',
    railKm: '32–39'
  },
  {
    id: 'freguesia',
    name: 'Freguesia do Ó',
    area: 'Zona Norte · São Paulo',
    city: 'São Paulo',
    lat: -23.492,
    lon: -46.697,
    rate: 0.023,
    humidity: 59,
    families: 84,
    soil: 'Solo residual argiloso',
    sensor: 'EST-006',
    sensors: 9,
    precipitation: 31,
    companyId: null,
    railKm: null
  }
];

export const checklist = [
  'Separe documentos em um saco plástico',
  'Deixe remédios e itens essenciais à mão',
  'Prepare água e uma troca de roupa',
  'Combine um ponto de encontro com a família',
  'Organize o transporte dos seus pets'
];