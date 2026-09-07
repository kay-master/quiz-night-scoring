export type AttemptedAnswer = {
  readonly round: number;
  readonly question: number;
  readonly answer: string;
};

export type TeamSubmission = {
  readonly teamName: string;
  readonly answers: readonly AttemptedAnswer[];
};
