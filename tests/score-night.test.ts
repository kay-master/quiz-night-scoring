import { describe, it, expect } from 'vitest';
import { scoreNight } from '../src/scoring/scorer.js';

describe('scoreNight', () => {
  it('returns standings sorted by score then name', () => {
    const standings = scoreNight([
      {
        teamName: 'The Quizzengers',
        answers: [
          { round: 1, question: 1, answer: 'paris' },
          { round: 1, question: 2, answer: '1968' },
          { round: 2, question: 1, answer: 'Blue Whale' },
        ],
      },
      {
        teamName: 'Aces',
        answers: [
          { round: 1, question: 1, answer: 'Paris' },
          { round: 1, question: 2, answer: '1969' },
          { round: 2, question: 1, answer: 'Blue whale' },
        ],
      },
    ]);

    expect(standings).toEqual([
      { teamName: 'Aces', totalScore: 3 },
      { teamName: 'The Quizzengers', totalScore: 2 },
    ]);
  });
});
