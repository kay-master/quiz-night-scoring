# Implementation todos

Focused checklist to fully implement [`requirements.md`](./requirements.md) on the existing scaffold. `requirements.md` remains the product source of truth.

## Domain

- [x] Define immutable answer key (Paris / 1969 / Blue whale)
- [x] Define team submission and attempted-answer types
- [x] Define standings entry shape and sort (score desc, name asc)

## Scoring

- [x] Match answers case-insensitively with edge trim only
- [x] Award one point per correct match; unanswered score zero
- [x] Score a team submission against the answer key
- [x] Add scoring-policy seam without alternate round rules
- [x] Cover Quizzengers sample scoring (total 2)

## Validation

- [x] Export size limits (100 answers/team, 500 teams/night)
- [x] Skip incomplete answers; continue the team
- [x] Skip unknown round/question; continue the team
- [x] Apply first-wins for duplicate round+question
- [x] Reject oversize team submission; warn and continue night
- [x] Truncate night past 500 teams; warn and continue
- [x] Reject empty or blank team name; continue night
- [x] Isolate faults per submission so one bad team never stops others

## CLI

- [x] Load night JSON from CLI argument
- [x] Score all teams and print standings (name + total)
- [x] Emit warnings for rejected or truncated input
- [x] Wire `npm run score` end-to-end on sample fixture

## Docs and test polish

- [x] Replace scaffold smoke test with behaviour-named coverage gaps filled
- [x] Document run/score/test, invalid-input policies, future seam, and one rejected alternative in README
- [x] Verify clean-machine path: install, test, and score from README

## Optional (stretch — not required for acceptance)

- [ ] Add per-round score breakdown alongside standings

## Out of scope

Do not implement:

- Per-round alternate scoring rules (§8)
- Auth, persistence, network, UI polish
