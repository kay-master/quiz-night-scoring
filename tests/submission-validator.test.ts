import { describe, it, expect } from 'vitest';
import {
  validateTeamSubmission,
  validateNightSubmissions,
} from '../src/validation/submission-validator.js';

describe('validateTeamSubmission', () => {
  it('skips incomplete answers and keeps the rest', () => {
    const result = validateTeamSubmission({
      teamName: 'Almost',
      answers: [
        { round: 1, question: 1, answer: 'Paris' },
        { round: 1, question: 2 },
        { question: 1, answer: 'x' },
        { round: 2, answer: 'y' },
        { round: 2, question: 1, answer: 'Blue Whale' },
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.submission.answers).toEqual([
        { round: 1, question: 1, answer: 'Paris' },
        { round: 2, question: 1, answer: 'Blue Whale' },
      ]);
    }
  });

  it('rejects a blank or whitespace-only team name', () => {
    const result = validateTeamSubmission({ teamName: '   ', answers: [] });
    expect(result.ok).toBe(false);
  });

  it('rejects a team that exceeds the answer limit', () => {
    const answers = Array.from({ length: 101 }, (_, index) => ({
      round: 1,
      question: index + 1,
      answer: 'x',
    }));
    const result = validateTeamSubmission({ teamName: 'Too Many', answers });
    expect(result.ok).toBe(false);
  });

  it('rejects a submission with a missing team name', () => {
    const result = validateTeamSubmission({ answers: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.warning.code).toBe('missing_team_name');
    }
  });

  it('rejects an empty object with no usable team identity', () => {
    const result = validateTeamSubmission({});
    expect(result.ok).toBe(false);
  });

  it('rejects a team when answers is not an array', () => {
    const result = validateTeamSubmission({
      teamName: 'Broken',
      answers: { round: 1, question: 1, answer: 'Paris' },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.warning.code).toBe('invalid_answers');
    }
  });

  it('accepts a team with exactly 100 answers', () => {
    const answers = Array.from({ length: 100 }, (_, index) => ({
      round: 1,
      question: index + 1,
      answer: 'x',
    }));
    const result = validateTeamSubmission({ teamName: 'Maxed', answers });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.submission.answers).toHaveLength(100);
    }
  });

  it('skips answers whose fields have the wrong types', () => {
    const result = validateTeamSubmission({
      teamName: 'Typed',
      answers: [
        { round: '1', question: 1, answer: 'Paris' },
        { round: 1, question: 1, answer: 42 },
        { round: 1, question: 1, answer: 'Paris' },
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.submission.answers).toEqual([
        { round: 1, question: 1, answer: 'Paris' },
      ]);
    }
  });
});

describe('validateNightSubmissions', () => {
  it('truncates after 500 valid teams and warns', () => {
    const raw = Array.from({ length: 501 }, (_, index) => ({
      teamName: `Team ${index}`,
      answers: [],
    }));
    const result = validateNightSubmissions(raw);
    expect(result.teams).toHaveLength(500);
    expect(
      result.warnings.some((warning) => warning.code === 'night_truncated'),
    ).toBe(true);
  });

  it('continues when one team is rejected so later teams still score', () => {
    const result = validateNightSubmissions([
      { teamName: '   ', answers: [] },
      {
        teamName: 'The Quizzengers',
        answers: [{ round: 1, question: 1, answer: 'paris' }],
      },
    ]);
    expect(result.teams.map((team) => team.teamName)).toEqual([
      'The Quizzengers',
    ]);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('isolates a malformed team entry without dropping neighbours', () => {
    const result = validateNightSubmissions([
      null,
      {
        teamName: 'Survivors',
        answers: [{ round: 1, question: 1, answer: 'Paris' }],
      },
    ]);
    expect(result.teams).toHaveLength(1);
    expect(result.teams[0]?.teamName).toBe('Survivors');
  });

  it('returns no teams and warns when the night payload is not an array', () => {
    const result = validateNightSubmissions({ teamName: 'Solo', answers: [] });
    expect(result.teams).toHaveLength(0);
    expect(
      result.warnings.some((warning) => warning.code === 'invalid_night'),
    ).toBe(true);
  });
});
