import { describe, it, expect } from 'vitest';
import {
  MAX_ANSWERS_PER_TEAM,
  MAX_TEAMS_PER_NIGHT,
} from '../src/validation/limits.js';

describe('submission limits', () => {
  it('caps answers per team at 100 and teams per night at 500', () => {
    expect(MAX_ANSWERS_PER_TEAM).toBe(100);
    expect(MAX_TEAMS_PER_NIGHT).toBe(500);
  });
});
