import { describe, it, expect } from 'vitest';
import type {
  AttemptedAnswer,
  TeamSubmission,
} from '../src/domain/team-submission.js';

describe('team submission types', () => {
  it('describes a team name with zero or more attempted answers', () => {
    const submission: TeamSubmission = {
      teamName: 'The Quizzengers',
      answers: [{ round: 1, question: 1, answer: 'paris' }],
    };
    const empty: TeamSubmission = { teamName: 'Solo', answers: [] };
    const attempted: AttemptedAnswer = submission.answers[0]!;

    expect(submission.teamName).toBe('The Quizzengers');
    expect(empty.answers).toHaveLength(0);
    expect(attempted.answer).toBe('paris');
  });
});
