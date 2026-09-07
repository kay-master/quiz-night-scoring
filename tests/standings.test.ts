import { describe, it, expect } from 'vitest';
import { sortStandings } from '../src/domain/standings.js';

describe('standings', () => {
  it('sorts by total score descending then team name ascending', () => {
    const sorted = sortStandings([
      { teamName: 'Zed', totalScore: 1 },
      { teamName: 'Alpha', totalScore: 3 },
      { teamName: 'Beta', totalScore: 3 },
      { teamName: 'Middle', totalScore: 2 },
    ]);

    expect(sorted.map((entry) => entry.teamName)).toEqual([
      'Alpha',
      'Beta',
      'Middle',
      'Zed',
    ]);
  });

  it('does not mutate the input array', () => {
    const input = [
      { teamName: 'B', totalScore: 1 },
      { teamName: 'A', totalScore: 2 },
    ] as const;
    const copy = [...input];
    sortStandings(input);
    expect(input).toEqual(copy);
  });
});
