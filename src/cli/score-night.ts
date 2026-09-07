import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import type { StandingEntry } from '../domain/standings.js';
import { scoreNight } from '../scoring/scorer.js';
import { validateNightSubmissions } from '../validation/submission-validator.js';

export const parseArgs = (
  argv: readonly string[],
): { ok: true; filePath: string } | { ok: false; message: string } => {
  const filePath = argv[2];
  if (typeof filePath !== 'string' || filePath.trim() === '') {
    return {
      ok: false,
      message: 'Usage: npm run score -- <path-to-night.json>',
    };
  }
  return { ok: true, filePath };
};

export const formatStandings = (standings: readonly StandingEntry[]): string =>
  standings
    .map((entry) => `${entry.teamName}\t${entry.totalScore}`)
    .join('\n') + (standings.length > 0 ? '\n' : '');

export const runScoreNight = async (
  argv: readonly string[],
  readTextFile: (path: string) => Promise<string>,
): Promise<{ exitCode: number; stdout: string; stderr: string }> => {
  const parsed = parseArgs(argv);
  if (!parsed.ok) {
    return { exitCode: 1, stdout: '', stderr: `${parsed.message}\n` };
  }

  let text: string;
  try {
    text = await readTextFile(parsed.filePath);
  } catch {
    return {
      exitCode: 1,
      stdout: '',
      stderr: `Could not read file: ${parsed.filePath}\n`,
    };
  }

  let json: unknown;
  try {
    json = JSON.parse(text) as unknown;
  } catch {
    return {
      exitCode: 1,
      stdout: '',
      stderr: 'Night file must contain valid JSON.\n',
    };
  }

  const { teams, warnings } = validateNightSubmissions(json);
  const standings = scoreNight(teams);
  const stderr = warnings.map((warning) => `${warning.message}\n`).join('');
  return {
    exitCode: 0,
    stdout: formatStandings(standings),
    stderr,
  };
};

const entry = async (): Promise<void> => {
  const result = await runScoreNight(process.argv, (filePath) =>
    readFile(filePath, 'utf8'),
  );
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  process.exitCode = result.exitCode;
};

const isCliEntry = process.argv[1] !== undefined
  && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCliEntry) {
  void entry();
}
