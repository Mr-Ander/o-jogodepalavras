import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeWord, evaluateGuess, getAttemptLimit, getDailyChallenge, isAllowedGuess, getSolvedTargets, isChallengeComplete } from '../src/game-logic.js';

test('normaliza palavras em português sem acento e caixa', () => {
  assert.equal(normalizeWord('Café'), 'CAFE');
  assert.equal(normalizeWord('Água'), 'AGUA');
});

test('avalia letras repetidas sem exagerar estados', () => {
  assert.deepEqual(evaluateGuess('CASAL', 'SALAS'), ['absent', 'correct', 'present', 'correct', 'present']);
});

test('retorna orçamento de tentativas pelo modo e dificuldade', () => {
  assert.equal(getAttemptLimit('letters', 'solo', 'normal'), 6);
  assert.equal(getAttemptLimit('letters', 'quartet', 'hard'), 8);
});

test('gera descritor determinístico do desafio diário', () => {
  const challenge = getDailyChallenge('2026-10-20', 'letters', 'solo', 'normal');
  assert.equal(challenge.date, '2026-10-20');
  assert.equal(challenge.mode, 'letters');
  assert.equal(challenge.format, 'solo');
  assert.equal(challenge.difficulty, 'normal');
  assert.ok(Array.isArray(challenge.answers));
});

test('aceita palavras comuns do português para palpites', () => {
  assert.equal(isAllowedGuess('AREIO'), true);
  assert.equal(isAllowedGuess('RATOS'), true);
  assert.equal(isAllowedGuess('MARIA'), true);
});

test('continua o desafio até resolver todos os alvos do dueto/quarteto', () => {
  const answers = ['PRATO', 'LIVRO'];
  const guesses = ['PRATO'];

  assert.deepEqual(getSolvedTargets(guesses, answers), ['PRATO']);
  assert.equal(isChallengeComplete(guesses, answers), false);

  const finalGuesses = ['PRATO', 'LIVRO'];
  assert.equal(isChallengeComplete(finalGuesses, answers), true);
});
