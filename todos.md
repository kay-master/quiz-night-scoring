# Implementation todos

Focused checklist to fully implement [`requirements.md`](./requirements.md) on the existing scaffold. `requirements.md` remains the product source of truth.

## Domain

- [ ] Define immutable answer key (Paris / 1969 / Blue whale)
- [ ] Define team submission and attempted-answer types
- [ ] Define standings entry shape and sort (score desc, name asc)

## Scoring

- [ ] Match answers case-insensitively with edge trim only
- [ ] Award one point per correct match; unanswered score zero
- [ ] Score a team submission against the answer key
- [ ] Add scoring-policy seam without alternate round rules
- [ ] Cover Quizzengers sample scoring (total 2)

## Validation

- [ ] Export size limits (100 answers/team, 500 teams/night)
- [ ] Skip incomplete answers; continue the team
- [ ] Skip unknown round/question; continue the team
- [ ] Apply first-wins for duplicate round+question
- [ ] Reject oversize team submission; warn and continue night
- [ ] Truncate night past 500 teams; warn and continue
- [ ] Reject empty or blank team name; continue night
- [ ] Isolate faults per submission so one bad team never stops others

## CLI

- [ ] Load night JSON from CLI argument
- [ ] Score all teams and print standings (name + total)
- [ ] Emit warnings for rejected or truncated input
- [ ] Wire `npm run score` end-to-end on sample fixture

## Docs and test polish

- [ ] Replace scaffold smoke test with behaviour-named coverage gaps filled
- [ ] Document run/score/test, invalid-input policies, future seam, and one rejected alternative in README
- [ ] Verify clean-machine path: install, test, and score from README

## Optional (stretch — not required for acceptance)

- [ ] Add per-round score breakdown alongside standings

## Out of scope

Do not implement:

- Per-round alternate scoring rules (§8)
- Auth, persistence, network, UI polish
