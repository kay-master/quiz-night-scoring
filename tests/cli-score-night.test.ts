import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { runScoreNight } from '../src/cli/score-night.js';

describe('runScoreNight', () => {
  it('scores the sample fixture and prints Quizzengers with total 2', async () => {
    const fixturePath = path.resolve('fixtures/sample-night.json');
    const result = await runScoreNight(
      ['node', 'score-night.ts', fixturePath],
      (filePath) => readFile(filePath, 'utf8'),
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('The Quizzengers');
    expect(result.stdout).toContain('2');
  });

  it('writes a warning when a team is rejected but still scores others', async () => {
    const payload = JSON.stringify([
      { teamName: '   ', answers: [] },
      {
        teamName: 'Ok',
        answers: [{ round: 1, question: 1, answer: 'Paris' }],
      },
    ]);
    const result = await runScoreNight(
      ['node', 'score-night.ts', 'memory.json'],
      async () => payload,
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toContain('Ok');
  });
});
