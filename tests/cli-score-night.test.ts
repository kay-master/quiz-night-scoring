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
    expect(result.stdout).toBe(
      [
        'Aces\t3',
        'Brainy Bunch\t3',
        'The Quizzengers\t2',
        'Latecomers\t1',
        'Zed Squad\t1',
        'Silent Knights\t0',
      ].join('\n') + '\n',
    );
  });

  it('defaults to fixtures/sample-night.json when no path is given', async () => {
    const result = await runScoreNight(
      ['node', 'score-night.ts'],
      (filePath) => readFile(filePath, 'utf8'),
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Aces\t3');
    expect(result.stdout).toContain('The Quizzengers\t2');
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

  it('exits nonzero when the night file cannot be read', async () => {
    const result = await runScoreNight(
      ['node', 'score-night.ts', 'missing-night.json'],
      async () => {
        throw new Error('ENOENT');
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Could not read file: missing-night.json');
  });

  it('exits nonzero when the night file is not valid JSON', async () => {
    const result = await runScoreNight(
      ['node', 'score-night.ts', 'broken.json'],
      async () => '{ not json',
    );

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Night file must contain valid JSON.');
  });
});
