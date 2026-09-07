import { describe, it, expect } from 'vitest';
import { matchesAnswer } from '../src/scoring/answer-matcher.js';

describe('matchesAnswer', () => {
  it('awards a match when letter case differs', () => {
    expect(matchesAnswer('paris', 'Paris')).toBe(true);
    expect(matchesAnswer('PARIS', 'Paris')).toBe(true);
    expect(matchesAnswer('pArIs', 'Paris')).toBe(true);
  });

  it('ignores only leading and trailing spaces', () => {
    expect(matchesAnswer(' Paris', 'Paris')).toBe(true);
    expect(matchesAnswer('Paris ', 'Paris')).toBe(true);
    expect(matchesAnswer('   Paris   ', 'Paris')).toBe(true);
  });

  it('treats internal spaces as significant', () => {
    expect(matchesAnswer('Blue  whale', 'Blue whale')).toBe(false);
    expect(matchesAnswer('Blue Whale', 'Blue whale')).toBe(true);
  });

  it('rejects a different answer', () => {
    expect(matchesAnswer('1968', '1969')).toBe(false);
  });
});
