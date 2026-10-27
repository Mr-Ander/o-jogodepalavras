const difficultyConfig = {
  easy: { letters: { solo: 8, duet: 9, quartet: 10 }, meaning: { hints: 3 } },
  normal: { letters: { solo: 6, duet: 7, quartet: 9 }, meaning: { hints: 1 } },
  hard: { letters: { solo: 5, duet: 6, quartet: 8 }, meaning: { hints: 0 } }
};

const answersByMode = {
  letters: {
    easy: { solo: ['CASAL', 'PRAIA'], duet: ['CASAL', 'PRAIA'], quartet: ['CASAL', 'PRAIA', 'LIVRO', 'NAVIO'] },
    normal: { solo: ['PRATO', 'CANTO'], duet: ['PRATO', 'LIVRO'], quartet: ['PRATO', 'LIVRO', 'NORTE', 'CAMPO'] },
    hard: { solo: ['TRUFA', 'BRISA'], duet: ['TRUFA', 'BRISA'], quartet: ['TRUFA', 'BRISA', 'ZEBRA', 'VIGOR'] }
  },
  meaning: {
    easy: ['PRAIA', 'MUSICA', 'LIVRO'],
    normal: ['MUSICA', 'PRAIA', 'CASA'],
    hard: ['INERCIA', 'RITMO', 'PENSAMENTO']
  }
};

const FALLBACK_DICTIONARY = {
  guesses: [
    'CASAL', 'PRAIA', 'PRATO', 'CANTO', 'TRUFA', 'BRISA', 'LIVRO', 'NAVIO', 'NORTE', 'CAMPO', 'ZEBRA', 'VIGOR',
    'MUSICA', 'CASA', 'INERCIA', 'RITMO', 'PENSAMENTO', 'ARTE', 'PAPEL', 'PEDRA', 'AMOR', 'RIO', 'NUVEM',
    'AREIO', 'RATOS', 'MARIA', 'MOEDA', 'RISCO', 'FELIZ', 'SONHO', 'PAUSA', 'JUNTO', 'FALHA', 'AMIGO', 'BEMOL',
    'VITRO', 'MELIA', 'RAIOS', 'MORRO', 'PATIO', 'ALUNO', 'CERTO', 'PARAR', 'SABIA', 'VIAJA', 'NIVEL', 'FONTE',
    'ASTRO', 'COISA', 'VIVER', 'FEMUR', 'SELO', 'TRAMA', 'RIRIA', 'PLENA', 'MANGA', 'TREVO', 'CHAVE', 'SINAL', 'ARCO',
    'MELAO', 'TERRA', 'GENTE', 'LUZES', 'MALHA', 'PONTE', 'PORTE', 'TEXTO', 'LIVRE', 'CADER', 'TROCA', 'LENTO',
    'GRUPO', 'MUNDO', 'SERIA', 'FARIA', 'TARDE', 'VOSSO', 'TROTE', 'CIVIL', 'MALDO', 'FICHA', 'RIVAL', 'VULGO',
    'VALOR', 'NOBRE', 'RURAL', 'PENAL', 'TENIS', 'XADRE', 'HELIO', 'DORIA', 'FALSO', 'REINO', 'AERAR', 'SABOR'
  ],
  answers: [
    'CASAL', 'PRAIA', 'PRATO', 'CANTO', 'TRUFA', 'BRISA', 'LIVRO', 'NAVIO', 'NORTE', 'CAMPO', 'ZEBRA', 'VIGOR',
    'MUSICA', 'CASA', 'INERCIA', 'RITMO', 'PENSAMENTO', 'ARTE', 'PAPEL', 'PEDRA', 'AMOR', 'RIO', 'NUVEM', 'AREIO',
    'RATOS', 'MARIA', 'MOEDA', 'RISCO', 'FELIZ', 'SONHO', 'PAUSA', 'JUNTO', 'FALHA', 'AMIGO', 'BEMOL', 'VITRO',
    'MELIA', 'RAIOS', 'MORRO', 'PATIO', 'ALUNO', 'CERTO', 'PARAR', 'SABIA', 'VIAJA', 'NIVEL', 'FONTE', 'ASTRO',
    'COISA', 'VIVER', 'FEMUR', 'SELO', 'TRAMA', 'RIRIA', 'PLENA', 'MANGA', 'TREVO', 'CHAVE', 'SINAL', 'ARCO', 'MELAO',
    'TERRA', 'GENTE', 'LUZES', 'MALHA', 'PONTE', 'PORTE', 'TEXTO', 'LIVRE', 'CADER', 'TROCA', 'LENTO', 'GRUPO',
    'MUNDO', 'SERIA', 'FARIA', 'TARDE', 'VOSSO', 'TROTE', 'CIVIL', 'MALDO', 'FICHA', 'RIVAL', 'VULGO', 'VALOR',
    'NOBRE', 'RURAL', 'PENAL', 'TENIS', 'XADRE', 'HELIO', 'DORIA', 'FALSO', 'REINO', 'AERAR', 'SABOR'
  ]
};

const dictionaryState = {
  guesses: new Set(FALLBACK_DICTIONARY.guesses.map(normalizeWord).filter(Boolean)),
  answers: new Set(FALLBACK_DICTIONARY.answers.map(normalizeWord).filter(Boolean)),
  loaded: true
};

export function refreshDictionary(data = FALLBACK_DICTIONARY) {
  const guesses = Array.isArray(data.guesses) ? data.guesses : FALLBACK_DICTIONARY.guesses;
  const answers = Array.isArray(data.answers) ? data.answers : FALLBACK_DICTIONARY.answers;

  dictionaryState.guesses = new Set(guesses.map(normalizeWord).filter(Boolean));
  dictionaryState.answers = new Set(answers.map(normalizeWord).filter(Boolean));
  dictionaryState.loaded = true;
}

export async function loadDictionaryFromFile(url = './data/dictionary.json') {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Dicionário indisponível');
    const data = await response.json();
    refreshDictionary(data);
    return data;
  } catch {
    refreshDictionary(FALLBACK_DICTIONARY);
    return FALLBACK_DICTIONARY;
  }
}

export function normalizeWord(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-ZÀ-Ÿ0-9]/gi, '')
    .toUpperCase('pt-BR');
}

export function evaluateGuess(guess, answer) {
  const target = normalizeWord(answer);
  const current = normalizeWord(guess);
  const states = Array(current.length).fill('absent');
  const remaining = [...target];

  for (let i = 0; i < current.length; i += 1) {
    if (current[i] === target[i]) {
      states[i] = 'correct';
      remaining[i] = '';
    }
  }

  for (let i = 0; i < current.length; i += 1) {
    if (states[i] !== 'correct') {
      const index = remaining.findIndex((letter) => letter === current[i]);
      if (index !== -1) {
        states[i] = 'present';
        remaining[index] = '';
      }
    }
  }

  return states;
}

export function getAttemptLimit(mode, format, difficulty) {
  if (mode !== 'letters') return Number.POSITIVE_INFINITY;
  return difficultyConfig[difficulty]?.letters?.[format] ?? 6;
}

export function getDailyChallenge(date, mode, format, difficulty) {
  const normalizedMode = mode === 'meaning' ? 'meaning' : 'letters';
  const normalizedFormat = normalizedMode === 'letters' ? (format || 'solo') : 'solo';
  const normalizedDifficulty = ['easy', 'normal', 'hard'].includes(difficulty) ? difficulty : 'normal';

  const answerPool = answersByMode[normalizedMode]?.[normalizedDifficulty]?.[normalizedFormat] ?? answersByMode.letters.normal.solo;

  const numericSeed = Array.from(date).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const index = numericSeed % answerPool.length;

  return {
    date,
    locale: 'pt-BR',
    mode: normalizedMode,
    format: normalizedFormat,
    difficulty: normalizedDifficulty,
    wordLength: 5,
    attemptsAllowed: getAttemptLimit(normalizedMode, normalizedFormat, normalizedDifficulty),
    answers: Array.isArray(answerPool) ? answerPool.slice() : [answerPool],
    target: answerPool[index],
    shareToken: `share-${date}-${normalizedMode}-${normalizedFormat}-${normalizedDifficulty}`
  };
}

export function isAllowedGuess(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return false;

  const compactValue = raw.replace(/\s+/g, '');
  if (compactValue.length !== 5) return false;
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/u.test(compactValue)) return false;

  const normalized = normalizeWord(compactValue);
  return normalized.length === 5 && dictionaryState.guesses.has(normalized);
}

export function getSolvedTargets(guesses = [], answers = []) {
  const normalizedGuesses = new Set((guesses || []).map(normalizeWord).filter(Boolean));
  return (answers || []).filter((answer) => normalizedGuesses.has(normalizeWord(answer)));
}

export function isChallengeComplete(guesses = [], answers = []) {
  const normalizedAnswers = (answers || []).map(normalizeWord).filter(Boolean);
  if (normalizedAnswers.length === 0) return false;
  const normalizedGuesses = new Set((guesses || []).map(normalizeWord).filter(Boolean));
  return normalizedAnswers.every((answer) => normalizedGuesses.has(answer));
}

export function getAnswerPool() {
  return [...dictionaryState.answers];
}

export function getHintCount(difficulty) {
  return difficultyConfig[difficulty]?.meaning?.hints ?? 0;
}
