export type AnswerKeyEntry = {
  readonly round: number;
  readonly question: number;
  readonly correctAnswer: string;
};

export const QUIZ_ANSWER_KEY: readonly AnswerKeyEntry[] = [
  { round: 1, question: 1, correctAnswer: 'Paris' },
  { round: 1, question: 2, correctAnswer: '1969' },
  { round: 2, question: 1, correctAnswer: 'Blue whale' },
];

export const getCorrectAnswer = (
  answerKey: readonly AnswerKeyEntry[],
  round: number,
  question: number,
): string | undefined => {
  const entry = answerKey.find(
    (item) => item.round === round && item.question === question,
  );
  return entry?.correctAnswer;
};
