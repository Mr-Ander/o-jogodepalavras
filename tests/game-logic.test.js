import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeWord,
  evaluateGuess,
  getAttemptLimit,
  getDailyChallenge,
  isAllowedGuess,
  getSolvedTargets,
  isChallengeComplete,
  getAnswerPool,
  getHintCount
} from '../src/game-logic.js';

test('normaliza palavras em português sem acento e caixa', () => {
  assert.equal(normalizeWord('Café'), 'CAFE');
  assert.equal(normalizeWord('Água'), 'AGUA');
  assert.equal(normalizeWord('música!!!'), 'MUSICA');
  assert.equal(normalizeWord('  r i o  '), 'RIO');
});

test('avalia letras repetidas sem exagerar estados', () => {
  assert.deepEqual(evaluateGuess('CASAL', 'SALAS'), ['absent', 'correct', 'present', 'correct', 'present']);
  assert.deepEqual(evaluateGuess('NUVEM', 'MUNDO'), ['present', 'correct', 'absent', 'absent', 'present']);
});

test('retorna orçamento de tentativas pelo modo e dificuldade', () => {
  assert.equal(getAttemptLimit('letters', 'solo', 'normal'), 6);
  assert.equal(getAttemptLimit('letters', 'quartet', 'hard'), 8);
  assert.equal(getAttemptLimit('meaning', 'solo', 'easy'), Number.POSITIVE_INFINITY);
  assert.equal(getAttemptLimit('letters', 'solo', 'unknown'), 6);
});

test('gera descritor determinístico do desafio diário', () => {
  const challenge = getDailyChallenge('2026-10-20', 'letters', 'solo', 'normal');
  assert.equal(challenge.date, '2026-10-20');
  assert.equal(challenge.mode, 'letters');
  assert.equal(challenge.format, 'solo');
  assert.equal(challenge.difficulty, 'normal');
  assert.ok(Array.isArray(challenge.answers));
  assert.equal(challenge.wordLength, 5);
  assert.equal(challenge.attemptsAllowed, 6);
});

test('normaliza entradas inválidas de desafio e mantém resposta consistente', () => {
  const fallback = getDailyChallenge('2026-10-20', 'meaning', 'solo', 'extreme');
  assert.equal(fallback.mode, 'meaning');
  assert.equal(fallback.format, 'solo');
  assert.equal(fallback.difficulty, 'normal');

  const lettersFallback = getDailyChallenge('2026-10-20', 'unknown', 'duet', 'hard');
  assert.equal(lettersFallback.mode, 'letters');
  assert.equal(lettersFallback.format, 'duet');
  assert.equal(lettersFallback.difficulty, 'hard');
});

test('aceita palavras comuns do português para palpites e rejeita entradas inválidas', () => {
  assert.equal(isAllowedGuess('AREIO'), true);
  assert.equal(isAllowedGuess('RATOS'), true);
  assert.equal(isAllowedGuess('MARIA'), true);

  assert.equal(isAllowedGuess('AREI'), false);
  assert.equal(isAllowedGuess('XYZZZ'), false);
  assert.equal(isAllowedGuess('PRAIA!'), false);
});

test('expõe o pool de respostas e a quantidade de dicas por dificuldade', () => {
  const pool = getAnswerPool();
  assert.ok(Array.isArray(pool));
  assert.ok(pool.length > 0);
  assert.ok(pool.includes('CASAL'));
  assert.ok(pool.includes('MUSICA'));

  assert.equal(getHintCount('easy'), 3);
  assert.equal(getHintCount('normal'), 1);
  assert.equal(getHintCount('hard'), 0);
  assert.equal(getHintCount('unknown'), 0);
});

test('continua o desafio até resolver todos os alvos do dueto/quarteto', () => {
  const answers = ['PRATO', 'LIVRO'];
  const guesses = ['PRATO'];

  assert.deepEqual(getSolvedTargets(guesses, answers), ['PRATO']);
  assert.equal(isChallengeComplete(guesses, answers), false);

  const finalGuesses = ['PRATO', 'LIVRO'];
  assert.equal(isChallengeComplete(finalGuesses, answers), true);
  assert.equal(isChallengeComplete([], answers), false);
});
