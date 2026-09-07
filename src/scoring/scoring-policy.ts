export type ScoringPolicy = {
  readonly pointsForMatch: number;
};

export const DEFAULT_SCORING_POLICY: ScoringPolicy = {
  pointsForMatch: 1,
};
