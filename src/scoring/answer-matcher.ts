export const matchesAnswer = (given: string, expected: string): boolean =>
  given.trim().toLowerCase() === expected.trim().toLowerCase();
