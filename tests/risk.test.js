import test from 'node:test';
import assert from 'node:assert/strict';
import { risk, canReturn, distance } from '../src/lib/risk.js';

test('classificação nos limites e leituras inválidas', () => {
  assert.equal(risk(0), 'stable');
  assert.equal(risk(0.039), 'stable');
  assert.equal(risk(0.04), 'attention');
  assert.equal(risk(0.1), 'critical');
  assert.equal(risk(-1), 'unknown');
  assert.equal(risk(NaN), 'unknown');
});

test('retorno exige taxa exatamente zero e vistoria', () => {
  assert.equal(canReturn(0.01, true), false);
  assert.equal(canReturn(0, false), false);
  assert.equal(canReturn(0, true), true);
});

test('distância geográfica básica', () => {
  assert.equal(distance({ lat: 0, lon: 0 }, { lat: 0, lon: 0 }), 0);
  const oneDegree = distance({ lat: 0, lon: 0 }, { lat: 0, lon: 1 });
  assert.ok(oneDegree > 111000 && oneDegree < 112000);
});
