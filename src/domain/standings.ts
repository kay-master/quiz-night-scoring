export type StandingEntry = {
  readonly teamName: string;
  readonly totalScore: number;
};

export const sortStandings = (
  entries: readonly StandingEntry[],
): StandingEntry[] =>
  [...entries].sort((left, right) => {
    if (right.totalScore !== left.totalScore) {
      return right.totalScore - left.totalScore;
    }
    if (left.teamName < right.teamName) {
      return -1;
    }
    if (left.teamName > right.teamName) {
      return 1;
    }
    return 0;
  });
