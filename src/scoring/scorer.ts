import {
  QUIZ_ANSWER_KEY,
  getCorrectAnswer,
  type AnswerKeyEntry,
} from '../domain/answer-key.js';
import type { TeamSubmission } from '../domain/team-submission.js';
import { matchesAnswer } from './answer-matcher.js';
import {
  DEFAULT_SCORING_POLICY,
  type ScoringPolicy,
} from './scoring-policy.js';

const questionKey = (round: number, question: number): string =>
  `${round}:${question}`;

export const scoreTeamSubmission = (
  submission: TeamSubmission,
  answerKey: readonly AnswerKeyEntry[] = QUIZ_ANSWER_KEY,
  policy: ScoringPolicy = DEFAULT_SCORING_POLICY,
): number => {
  const seen = new Set<string>();
  let total = 0;

  submission.answers.forEach((attempt) => {
    const key = questionKey(attempt.round, attempt.question);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);

    const expected = getCorrectAnswer(
      answerKey,
      attempt.round,
      attempt.question,
    );
    if (expected === undefined) {
      return;
    }

    if (matchesAnswer(attempt.answer, expected)) {
      total += policy.pointsForMatch;
    }
  });

  return total;
};
