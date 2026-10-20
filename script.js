import { evaluateGuess, getAttemptLimit, getDailyChallenge, isAllowedGuess, normalizeWord, getHintCount, loadDictionaryFromFile } from './src/game-logic.js';
import { getSolvedTargets, isChallengeComplete } from './src/game-logic.js';

const state = {
  mode: 'letters',
  format: 'solo',
  difficulty: 'normal',
  date: '2026-10-20',
  challenge: null,
  guesses: [],
  draft: '',
  hints: [],
  won: false,
  currentTarget: null
};

const app = document.getElementById('game-root');
const statusNode = document.getElementById('status');
const titleNode = document.getElementById('title');
const subtitleNode = document.getElementById('subtitle');
const modeEyebrow = document.getElementById('mode-eyebrow');
const difficultyNote = document.getElementById('difficulty-note');
const challengeLabel = document.getElementById('challenge-label');

const boardTemplates = {
  easy: { letters: '8 tentativas · palavras comuns', meaning: '3 dicas · palavras familiares' },
  normal: { letters: '6 tentativas · palavras do dia a dia', meaning: '1 dica · vocabulário cotidiano' },
  hard: { letters: '5 tentativas · vocabulário mais raro', meaning: 'Sem dicas · palavras menos comuns' }
};

function setStatus(message, kind = '') {
  statusNode.textContent = message;
  statusNode.className = 'status';
  if (kind) statusNode.classList.add(kind);
}

function getDaily() {
  const challenge = getDailyChallenge(state.date, state.mode, state.format, state.difficulty);
  state.challenge = challenge;
  state.currentTarget = challenge.target;
  return challenge;
}

function updateSelectors() {
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === state.mode);
  });

  const formatButtons = document.querySelectorAll('[data-format]');
  formatButtons.forEach((button) => {
    const isActive = button.dataset.format === state.format && state.mode === 'letters';
    button.classList.toggle('active', isActive);
    button.disabled = state.mode !== 'letters';
  });

  document.querySelectorAll('[data-difficulty]').forEach((button) => {
    button.classList.toggle('active', button.dataset.difficulty === state.difficulty);
  });

  const modeLabel = state.mode === 'letters' ? `Letras · ${state.format}` : 'Significados';
  const challengeDate = new Date(`${state.date}T12:00:00`);
  const dateText = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(challengeDate).replace(/\./g, '');
  challengeLabel.textContent = `Desafio de hoje · ${dateText}`;
  modeEyebrow.textContent = `${modeLabel.charAt(0).toUpperCase() + modeLabel.slice(1)} · desafio 284`;

  if (state.mode === 'letters') {
    titleNode.textContent = state.format === 'quartet' ? 'Descubra quatro palavras' : state.format === 'duet' ? 'Descubra duas palavras' : 'Qual é a palavra?';
    subtitleNode.textContent = state.format === 'solo'
      ? `Descubra a palavra de cinco letras em até ${getAttemptLimit('letters', state.format, state.difficulty)} tentativas.`
      : `Um palpite por rodada atualiza todos os tabuleiros. Você tem ${getAttemptLimit('letters', state.format, state.difficulty)} tentativas compartilhadas.`;
    difficultyNote.textContent = boardTemplates[state.difficulty].letters;
  } else {
    titleNode.textContent = 'A que palavra ela se aproxima?';
    subtitleNode.textContent = 'Digite uma palavra e acompanhe o índice de proximidade semântica.';
    difficultyNote.textContent = boardTemplates[state.difficulty].meaning;
  }

  renderChallenge();
}

function buildBoardRows(guess, answer) {
  const states = evaluateGuess(guess, answer);
  const cells = Array.from({ length: 5 }, (_, index) => {
    const letter = guess[index] ?? '';
    const state = states[index] ?? 'empty';
    const symbolMap = { correct: '✓', present: '↔', absent: '×' };
    return `<span class="tile ${state === 'empty' ? '' : state}" aria-label="${letter || 'vazia'} ${state === 'correct' ? 'em posição correta' : state === 'present' ? 'na palavra em outra posição' : state === 'absent' ? 'não aparece na palavra' : 'vazia'}">${letter}${state !== 'empty' && state !== 'absent' ? `<span class="tile-symbol">${symbolMap[state]}</span>` : ''}</span>`;
  });
  return `<div class="row">${cells.join('')}</div>`;
}

function renderLettersBoard() {
  const challenge = getDaily();
  const limit = getAttemptLimit('letters', state.format, state.difficulty);
  const answers = challenge.answers;
  const solvedTargets = getSolvedTargets(state.guesses, answers);
  const roundSolved = isChallengeComplete(state.guesses, answers);
  const boards = answers.map((answer, index) => {
    const isSolved = solvedTargets.includes(answer);
    const visibleRows = [];
    for (let attempt = 0; attempt < limit; attempt += 1) {
      const guess = state.guesses[attempt];
      const rowState = guess && guess !== '' ? buildBoardRows(guess, answer) : `<div class="row">${Array.from({ length: 5 }, () => '<span class="tile"></span>').join('')}</div>`;
      visibleRows.push(rowState);
    }
    const label = isSolved ? '<span class="solved">✓ Resolvida</span>' : '<span>Em jogo</span>';
    return `
      <section class="board-panel">
        <div class="board-meta"><span>Palavra ${index + 1}/${answers.length}</span>${label}</div>
        <div class="board">${visibleRows.join('')}</div>
      </section>
    `;
  });

  const formDisabled = roundSolved || state.guesses.length >= limit;
  app.innerHTML = `
    <div class="board-grid ${answers.length > 1 ? 'multi' : ''}">
      ${boards.join('')}
    </div>
    <form class="guess-form" id="letters-form">
      <label class="sr-only" for="letters-input">Palpite</label>
      <input id="letters-input" class="guess-input" value="${state.draft}" maxlength="5" autocomplete="off" spellcheck="false" placeholder="Digite uma palavra" ${formDisabled ? 'disabled' : ''} />
      <button class="submit-button" type="submit" ${formDisabled ? 'disabled' : ''}>Enviar</button>
    </form>
    <div class="keyboard" aria-label="Teclado virtual">
      <div class="keyboard-row">${'QWERTYUIOP'.split('').map((letter) => `<button class="key" type="button" data-key="${letter}">${letter}</button>`).join('')}</div>
      <div class="keyboard-row">${'ASDFGHJKL'.split('').map((letter) => `<button class="key" type="button" data-key="${letter}">${letter}</button>`).join('')}</div>
      <div class="keyboard-row"><button class="key wide" type="button" data-key="BACKSPACE">Apagar</button>${'ZXCVBNM'.split('').map((letter) => `<button class="key" type="button" data-key="${letter}">${letter}</button>`).join('')}<button class="key wide" type="button" data-key="ENTER">Enviar</button></div>
    </div>
  `;

  const keyRows = app.querySelectorAll('.key');
  keyRows.forEach((button) => {
    button.addEventListener('click', () => handleVirtualKey(button.dataset.key));
  });

  app.querySelector('#letters-form').addEventListener('submit', (event) => {
    event.preventDefault();
    submitGuess();
  });

  app.querySelector('#letters-input').addEventListener('input', (event) => {
    const cleaned = normalizeWord(event.target.value).replace(/[^A-Z]/g, '').slice(0, 5);
    state.draft = cleaned;
    event.target.value = cleaned;
  });

  if (!state.won) {
    const input = app.querySelector('#letters-input');
    if (input) input.focus();
  }
}

function renderMeaningBoard() {
  const challenge = getDaily();
  const clues = getHintCount(state.difficulty);
  const rankList = state.guesses.map((guess, index) => {
    const normalized = normalizeWord(guess);
    const rank = normalized === challenge.target ? 1 : 200 + ((normalized.length * 31 + index * 7) % 3000);
    return `
      <li class="rank-item">
        <span class="rank-number">#${index + 1}</span>
        <span class="rank-word">${guess}</span>
        <span class="rank-label">${rank === 1 ? 'Resposta' : rank <= 10 ? 'Muito perto' : rank <= 100 ? 'Perto' : 'Distante'}</span>
      </li>
    `;
  }).join('');

  app.innerHTML = `
    <div class="semantic-panel">
      <div class="semantic-score">
        <strong>${state.guesses.length ? '#' + (state.guesses[0] && normalizeWord(state.guesses[0]) === challenge.target ? 1 : 42) : '—'}</strong>
        <span>${state.guesses.length ? 'melhor palpite · ' + state.guesses[0] : 'aguardando seu primeiro palpite'}</span>
      </div>
      <form class="guess-form" id="meaning-form">
        <input id="meaning-input" class="guess-input" maxlength="32" autocomplete="off" spellcheck="false" placeholder="Digite uma palavra" />
        <button class="submit-button" type="submit">Tentar</button>
      </form>
      <div class="hint-row">
        <button type="button" class="hint-button" id="hint-button" ${clues === 0 ? 'disabled' : ''}>Pedir uma dica</button>
        <span class="hint-count">${clues - state.hints.length} disponíveis</span>
      </div>
      <ul class="hint-list">${state.hints.map((hint) => `<li>${hint}</li>`).join('')}</ul>
      <ol class="rank-list">${rankList || '<li class="rank-item"><span class="rank-number">—</span><span class="rank-word">Seus palpites aparecem aqui</span><span class="rank-label">0 palavras</span></li>'}</ol>
      <p class="semantic-note">O número indica proximidade de significado. Quanto menor, mais próximo do alvo.</p>
    </div>
  `;

  app.querySelector('#meaning-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const word = document.getElementById('meaning-input').value.trim();
    if (!word) {
      setStatus('Digite uma palavra para receber o ranking.', 'error');
      return;
    }
    const normalized = normalizeWord(word);
    if (!isAllowedGuess(normalized)) {
      setStatus('Essa palavra não está no vocabulário aceito.', 'error');
      return;
    }
    state.guesses.unshift(normalized);
    const won = normalized === challenge.target;
    state.won = won;
    setStatus(won ? `Você encontrou a palavra: ${challenge.target}.` : `Palpite registrado. Proximidade ${won ? 1 : 42}.`, won ? 'success' : '');
    renderChallenge();
  });

  app.querySelector('#hint-button').addEventListener('click', () => {
    if (state.hints.length >= clues) {
      setStatus('Você já usou todas as dicas disponíveis.', 'error');
      return;
    }
    const hintPool = {
      easy: ['É um lugar de descanso', 'Tem areia e mar', 'Muita gente visita no verão'],
      normal: ['Pode ser ouvida, cantada ou tocada'],
      hard: []
    };
    const hint = hintPool[state.difficulty][state.hints.length];
    if (!hint) return;
    state.hints.push(hint);
    setStatus('Nova dica revelada.');
    renderChallenge();
  });
}

function renderChallenge() {
  if (state.mode === 'letters') {
    renderLettersBoard();
  } else {
    renderMeaningBoard();
  }
}

function handleVirtualKey(key) {
  const input = app.querySelector('#letters-input');
  if (!input || input.disabled) return;
  if (key === 'ENTER') {
    submitGuess();
    return;
  }
  if (key === 'BACKSPACE') {
    state.draft = state.draft.slice(0, -1);
  } else if (state.draft.length < 5) {
    state.draft += normalizeWord(key).slice(0, 1);
  }
  input.value = state.draft;
}

function submitGuess() {
  const challenge = getDaily();
  const rawGuess = state.draft || (app.querySelector('#letters-input') ? app.querySelector('#letters-input').value : '');
  const guess = normalizeWord(rawGuess);
  if (guess.length !== 5) {
    setStatus('Digite uma palavra com cinco letras.', 'error');
    return;
  }
  if (!isAllowedGuess(guess)) {
    setStatus('Essa palavra não está no dicionário permitido.', 'error');
    state.draft = '';
    renderChallenge();
    return;
  }

  if (state.guesses.includes(guess)) {
    setStatus('Você já tentou esta palavra.', 'error');
    return;
  }

  const limit = getAttemptLimit('letters', state.format, state.difficulty);
  if (state.guesses.length >= limit) {
    setStatus('Você já usou todas as tentativas.', 'error');
    return;
  }

  state.guesses.push(guess);
  state.draft = '';
  const solvedWords = getSolvedTargets(state.guesses, challenge.answers);
  const fullySolved = isChallengeComplete(state.guesses, challenge.answers);
  const guessSolved = solvedWords.includes(guess);
  state.won = fullySolved || state.guesses.length >= limit;

  if (fullySolved) {
    setStatus('Você resolveu todos os alvos do desafio.', 'success');
  } else if (guessSolved) {
    const remaining = challenge.answers.filter((answer) => !solvedWords.includes(answer));
    setStatus(remaining.length > 0 ? `Você encontrou uma palavra correta. Faltam: ${remaining.join(', ')}.` : 'Você encontrou uma palavra correta.', 'success');
  } else if (state.guesses.length >= limit) {
    setStatus(`Fim de jogo. Respostas restantes: ${challenge.answers.filter((answer) => !solvedWords.includes(answer)).join(', ')}`, 'error');
  } else {
    setStatus(`Palpite aplicado. ${limit - state.guesses.length} tentativas restantes.`, '');
  }
  renderChallenge();
}

function attachEvents() {
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      state.guesses = [];
      state.hints = [];
      state.draft = '';
      state.won = false;
      setStatus('');
      updateSelectors();
    });
  });

  document.querySelectorAll('[data-format]').forEach((button) => {
    button.addEventListener('click', () => {
      state.format = button.dataset.format;
      state.guesses = [];
      state.hints = [];
      state.draft = '';
      state.won = false;
      setStatus('');
      updateSelectors();
    });
  });

  document.querySelectorAll('[data-difficulty]').forEach((button) => {
    button.addEventListener('click', () => {
      state.difficulty = button.dataset.difficulty;
      state.guesses = [];
      state.hints = [];
      state.draft = '';
      state.won = false;
      setStatus('');
      updateSelectors();
    });
  });

  document.getElementById('archive-button').addEventListener('click', () => {
    document.getElementById('archive-dialog').showModal();
  });

  document.getElementById('stats-button').addEventListener('click', () => {
    document.getElementById('stats-dialog').showModal();
  });

  document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.closeDialog);
      if (target) target.close();
    });
  });

  document.querySelectorAll('.archive-load').forEach((button) => {
    button.addEventListener('click', () => {
      state.date = button.dataset.date;
      state.mode = button.dataset.mode;
      state.format = button.dataset.format;
      state.difficulty = button.dataset.difficulty;
      state.guesses = [];
      state.hints = [];
      state.draft = '';
      state.won = false;
      document.getElementById('archive-dialog').close();
      setStatus('Desafio anterior carregado. Sua sequência diária não foi alterada.');
      updateSelectors();
    });
  });

  document.getElementById('share-button').addEventListener('click', () => {
    const params = new URLSearchParams({
      mode: state.mode,
      format: state.format,
      difficulty: state.difficulty,
      date: state.date
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    document.getElementById('share-url').value = shareUrl;
    document.getElementById('share-dialog').showModal();
  });

  document.getElementById('copy-link').addEventListener('click', async () => {
    const input = document.getElementById('share-url');
    try {
      await navigator.clipboard.writeText(input.value);
      document.getElementById('copy-feedback').textContent = 'Link copiado.';
    } catch {
      input.select();
      document.getElementById('copy-feedback').textContent = 'Link selecionado. Use Ctrl+C para copiar.';
    }
  });

  document.addEventListener('keydown', (event) => {
    if (state.mode !== 'letters') return;
    const active = document.activeElement;
    const input = document.getElementById('letters-input');
    if (active && active === input) return;
    if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
      handleVirtualKey(event.key.toUpperCase());
    }
    if (event.key === 'Backspace') {
      handleVirtualKey('BACKSPACE');
    }
  });
}

function hydrateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const format = params.get('format');
  const difficulty = params.get('difficulty');
  const date = params.get('date');

  if (mode === 'letters' || mode === 'meaning') state.mode = mode;
  if (format === 'solo' || format === 'duet' || format === 'quartet') state.format = format;
  if (difficulty === 'easy' || difficulty === 'normal' || difficulty === 'hard') state.difficulty = difficulty;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date || '')) state.date = date;
}

hydrateFromQuery();
loadDictionaryFromFile('./data/dictionary.json');
attachEvents();
updateSelectors();
