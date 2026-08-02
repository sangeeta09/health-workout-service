import test from 'node:test';
import assert from 'node:assert/strict';
import { createDailyPlan, renderPlan } from '../src/plan.js';
import { millisecondsUntilSevenIndia } from '../src/scheduler.js';

test('creates a full strength session when knee pain is low', () => {
  const plan = createDailyPlan({ kneePain: 2 });
  assert.equal(plan.level, 'strength');
  assert.equal(plan.totalMinutes, 55);
  assert.match(renderPlan(plan), /Leg press/);
});

test('removes lower-body strength work when symptoms need recovery', () => {
  const plan = createDailyPlan({ kneePain: 7 });
  assert.equal(plan.level, 'recovery');
  assert.doesNotMatch(renderPlan(plan), /Leg press/);
});

test('pauses training for knee red flags', () => {
  const plan = createDailyPlan({ kneePain: 1, locking: true });
  assert.equal(plan.level, 'pause');
  assert.match(renderPlan(plan), /clinical advice/);
});

test('schedules the next 7 AM India occurrence', () => {
  const beforeSeven = new Date('2026-08-02T01:00:00.000Z');
  assert.equal(millisecondsUntilSevenIndia(beforeSeven), 30 * 60 * 1000);
});
