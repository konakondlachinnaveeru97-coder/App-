import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getTracking, DELIVERY_MINUTES } from '../src/services/tracking.js';

const created = new Date('2026-01-01T18:08:00Z');
const at = (min) => new Date(created.getTime() + min * 60000);

test('progresses through each stage over time', () => {
  assert.equal(getTracking(created, at(0)).stage, 'confirmed');
  assert.equal(getTracking(created, at(7)).stage, 'baking');
  assert.equal(getTracking(created, at(21)).stage, 'packed');
  assert.equal(getTracking(created, at(30)).stage, 'out');
  assert.equal(getTracking(created, at(DELIVERY_MINUTES)).stage, 'delivered');
});

test('marks the next step and counts down minutes', () => {
  const t = getTracking(created, at(15));
  assert.deepEqual(t.steps.map((s) => s.next), [false, false, true, false]);
  assert.equal(t.minutesAway, DELIVERY_MINUTES - 15);
  assert.equal(t.eta, at(DELIVERY_MINUTES).toISOString());
});

test('all steps are done once delivered', () => {
  const t = getTracking(created, at(60));
  assert.ok(t.delivered);
  assert.ok(t.steps.every((s) => s.done));
  assert.equal(t.minutesAway, 0);
});
