import { describe, it, expect } from 'vitest';
import { QUIZ_ANSWER_KEY, getCorrectAnswer } from '../src/domain/answer-key.js';

describe('answer key', () => {
  it('starts with Paris, 1969, and Blue whale exactly', () => {
    expect(QUIZ_ANSWER_KEY).toEqual([
      { round: 1, question: 1, correctAnswer: 'Paris' },
      { round: 1, question: 2, correctAnswer: '1969' },
      { round: 2, question: 1, correctAnswer: 'Blue whale' },
    ]);
  });

  it('returns the correct answer for a known round and question', () => {
    expect(getCorrectAnswer(QUIZ_ANSWER_KEY, 1, 1)).toBe('Paris');
  });

  it('returns undefined for an unknown round or question', () => {
    expect(getCorrectAnswer(QUIZ_ANSWER_KEY, 9, 9)).toBeUndefined();
  });
});
