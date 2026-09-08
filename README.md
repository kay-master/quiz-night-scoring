# Quiz Night Scoring

Score one quiz night from a JSON file and print final standings.

Product rules live in [`requirements.md`](./requirements.md).

## Runtime

- Node.js 20 or newer
- npm 10+ (ships with Node)

## Install

```bash
npm install
```

## Run tests

```bash
npm test
```

## Score a night

```bash
npm run score
```

Defaults to `fixtures/sample-night.json`. Pass another file when you want:

```bash
npm run score -- path/to/night.json
```

You should see standings like:

```text
Aces	3
Brainy Bunch	3
The Quizzengers	2
Latecomers	1
Zed Squad	1
Silent Knights	0
```

Highest total first. Ties break alphabetically by team name.

## Invalid-input policies

Team answers are untrusted. Malformed input never stops the night or drops another team’s valid result. Policies from `requirements.md` §7:

- **Incomplete answer.** Missing round, question, or answer text. Skip that answer only. Keep scoring the rest of the team.
- **Unknown round or question.** Not in the answer key. Skip that answer only.
- **Duplicate round + question.** First answer wins. Later duplicates are ignored.
- **Size limits.** At most 100 answers per team and 500 teams per night. Oversize teams are rejected with a warning. Nights past 500 valid teams are truncated with a warning. Scoring continues either way.
- **Blank or missing team name.** Reject that submission. Continue with other teams.
- **Fault isolation.** Validate and score each team inside its own boundary so one bad submission cannot stop the others.

## Future scoring rules

Round 3 and Round 5 alternate rules are not implemented. When they arrive, change `src/scoring/scoring-policy.ts` and the scorer. Keep the answer key and raw team submissions immutable. Recalculate derived scores. Do not mutate stored answers to apply new rules.

## Design decision

Scores are derived on each run from the answer key and raw submissions. They are not persisted as the source of truth.

**Rejected alternative.** Persist each team’s total on the submission and update that field when rules change.

**Why.** Rescoring under new round rules must leave original answers untouched. Derived totals make that safe. Stored totals invite mutation of the night’s history.

## Layout

```text
src/
  domain/       Answer key, submissions, standings
  scoring/      Matching, scoring-policy seam, scoring engine
  validation/   Untrusted-input limits and validation
  cli/          Command-line entrypoint
fixtures/       Sample night input
tests/          Behaviour tests
```
