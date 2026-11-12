import test from 'node:test';
import assert from 'node:assert/strict';

import {
  risk,
  canReturn,
  distance
} from '../src/lib/risk.js';

// ==================================================
// TESTE 1 - CLASSIFICAÇÃO DOS NÍVEIS DE RISCO
// ==================================================

test('limiares em 40% e 100% e leitura invalida', () => {
  // Abaixo de 40% do limite crítico
  assert.equal(
    risk(0.039),
    'stable'
  );

  // A partir de 40% do limite crítico
  assert.equal(
    risk(0.04),
    'attention'
  );

  // A partir de 100% do limite crítico
  assert.equal(
    risk(0.1),
    'critical'
  );

  // Leitura inválida
  assert.equal(
    risk(NaN),
    'unknown'
  );
});

// ==================================================
// TESTE 2 - CONDIÇÕES PARA RETORNO SEGURO
// ==================================================

test('retorno exige estabilidade E vistoria', () => {
  // Solo instável, mesmo com vistoria
  assert.equal(
    canReturn(0.01, true),
    false
  );

  // Solo estável, mas sem vistoria
  assert.equal(
    canReturn(0, false),
    false
  );

  // Solo estável e vistoria concluída
  assert.equal(
    canReturn(0, true),
    true
  );
});

// ==================================================
// TESTE 3 - DISTÂNCIA GEOGRÁFICA
// ==================================================

test('distancia geografica', () => {
  // Distância entre coordenadas iguais
  assert.equal(
    distance(
      { lat: 0, lon: 0 },
      { lat: 0, lon: 0 }
    ),
    0
  );

  // Distância entre pontos separados por 1° de longitude
  assert.ok(
    distance(
      { lat: 0, lon: 0 },
      { lat: 0, lon: 1 }
    ) > 111000
  );
});
