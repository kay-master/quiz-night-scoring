# Quiz Night Scoring

Scores one quiz night and prints final standings.

## Requirements

- Node.js 20 or newer
- npm 10+ (comes with Node)

## Setup

```bash
npm install
```

## Run tests

```bash
npm test
```

## Score a night

```bash
npm run score -- fixtures/sample-night.json
```

Scoring behaviour is not implemented yet — this repository is scaffolded only.

## Layout

```text
src/
  domain/       Answer key, submissions, standings
  scoring/      Matching, policy seam, scoring engine
  validation/   Untrusted-input limits and validation
  cli/          Command-line entrypoint
fixtures/       Sample night input
tests/          Behaviour tests
```
