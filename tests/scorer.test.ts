import { describe, it, expect } from 'vitest';
import { scoreTeamSubmission } from '../src/scoring/scorer.js';
import { DEFAULT_SCORING_POLICY } from '../src/scoring/scoring-policy.js';
import { QUIZ_ANSWER_KEY } from '../src/domain/answer-key.js';

describe('scoreTeamSubmission', () => {
  it('exposes a default policy of one point per correct match', () => {
    expect(DEFAULT_SCORING_POLICY.pointsForMatch).toBe(1);
  });

  it('awards one point per correct match and zero for wrong or missing answers', () => {
    const total = scoreTeamSubmission(
      {
        teamName: 'Partial',
        answers: [
          { round: 1, question: 1, answer: 'Paris' },
          { round: 1, question: 2, answer: '1968' },
        ],
      },
      QUIZ_ANSWER_KEY,
      DEFAULT_SCORING_POLICY,
    );
    expect(total).toBe(1);
  });

  it('scores The Quizzengers sample as 2 points', () => {
    const total = scoreTeamSubmission({
      teamName: 'The Quizzengers',
      answers: [
        { round: 1, question: 1, answer: 'paris' },
        { round: 1, question: 2, answer: '1968' },
        { round: 2, question: 1, answer: 'Blue Whale' },
      ],
    });
    expect(total).toBe(2);
  });

  it('uses the first answer when the same question appears twice', () => {
    const total = scoreTeamSubmission({
      teamName: 'Dupes',
      answers: [
        { round: 1, question: 1, answer: 'Paris' },
        { round: 1, question: 1, answer: 'London' },
      ],
    });
    expect(total).toBe(1);
  });

  it('ignores unknown round or question without adding points', () => {
    const total = scoreTeamSubmission({
      teamName: 'Explorer',
      answers: [
        { round: 1, question: 1, answer: 'Paris' },
        { round: 99, question: 1, answer: 'Nope' },
      ],
    });
    expect(total).toBe(1);
  });
});
