import { MAX_ANSWERS_PER_TEAM, MAX_TEAMS_PER_NIGHT } from './limits.js';
import type {
  AttemptedAnswer,
  TeamSubmission,
} from '../domain/team-submission.js';

export type ValidationWarning = {
  readonly code: string;
  readonly message: string;
};

export type TeamValidationResult =
  | {
      readonly ok: true;
      readonly submission: TeamSubmission;
      readonly warnings: readonly ValidationWarning[];
    }
  | {
      readonly ok: false;
      readonly warning: ValidationWarning;
    };

export type NightValidationResult = {
  readonly teams: readonly TeamSubmission[];
  readonly warnings: readonly ValidationWarning[];
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const parseAttempt = (raw: unknown): AttemptedAnswer | undefined => {
  if (raw === null || typeof raw !== 'object') {
    return undefined;
  }
  const { round, question, answer } = raw as Record<string, unknown>;
  if (typeof round !== 'number' || !Number.isFinite(round)) {
    return undefined;
  }
  if (typeof question !== 'number' || !Number.isFinite(question)) {
    return undefined;
  }
  if (typeof answer !== 'string') {
    return undefined;
  }
  return { round, question, answer };
};

export const validateTeamSubmission = (raw: unknown): TeamValidationResult => {
  if (raw === null || typeof raw !== 'object') {
    return {
      ok: false,
      warning: {
        code: 'invalid_team',
        message: 'Team submission must be an object with a team name.',
      },
    };
  }

  const record = raw as Record<string, unknown>;
  if (!isNonEmptyString(record.teamName)) {
    return {
      ok: false,
      warning: {
        code: 'missing_team_name',
        message: 'Rejecting submission with empty or missing team name.',
      },
    };
  }

  const teamName = record.teamName.trim();
  const rawAnswers = record.answers;

  if (rawAnswers === undefined) {
    return {
      ok: true,
      submission: { teamName, answers: [] },
      warnings: [],
    };
  }

  if (!Array.isArray(rawAnswers)) {
    return {
      ok: false,
      warning: {
        code: 'invalid_answers',
        message: `Team "${teamName}" answers must be an array.`,
      },
    };
  }

  if (rawAnswers.length > MAX_ANSWERS_PER_TEAM) {
    return {
      ok: false,
      warning: {
        code: 'team_too_large',
        message: `Rejecting "${teamName}": more than ${MAX_ANSWERS_PER_TEAM} answers.`,
      },
    };
  }

  const answers = rawAnswers.flatMap((item) => {
    const parsed = parseAttempt(item);
    return parsed === undefined ? [] : [parsed];
  });

  return {
    ok: true,
    submission: { teamName, answers },
    warnings: [],
  };
};

export const validateNightSubmissions = (
  raw: unknown,
): NightValidationResult => {
  if (!Array.isArray(raw)) {
    return {
      teams: [],
      warnings: [
        {
          code: 'invalid_night',
          message: 'Night submissions must be a JSON array of teams.',
        },
      ],
    };
  }

  const warnings: ValidationWarning[] = [];
  const teams: TeamSubmission[] = [];
  let truncated = false;

  raw.forEach((entry, index) => {
    try {
      const result = validateTeamSubmission(entry);
      if (!result.ok) {
        warnings.push(result.warning);
        return;
      }

      if (teams.length >= MAX_TEAMS_PER_NIGHT) {
        truncated = true;
        return;
      }

      warnings.push(...result.warnings);
      teams.push(result.submission);
    } catch {
      warnings.push({
        code: 'team_validation_failed',
        message: `Skipping team at index ${index} due to unexpected validation failure.`,
      });
    }
  });

  if (truncated) {
    warnings.push({
      code: 'night_truncated',
      message: `Accepted first ${MAX_TEAMS_PER_NIGHT} valid teams; ignored the rest.`,
    });
  }

  return { teams, warnings };
};
