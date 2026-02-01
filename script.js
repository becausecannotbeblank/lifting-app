// ===============================
// Data model
// ===============================

let routines = [];

const exerciseDb = [
  "Bench Press",
  "Incline Bench Press",
  "Overhead Press",
  "Squat",
  "Front Squat",
  "Deadlift",
  "Romanian Deadlift",
  "Barbell Row",
  "Pull-up",
  "Lat Pulldown",
  "Side Lateral Raise",
  "Dumbbell Curls",
  "Barbell Curls",
  "Incline Dumbbell Curls"
];

// ===============================
// Elements
// ===============================

const addRoutineBtn = document.getElementById('add-routine');
const routinesContainer = document.getElementById('routines');

// ===============================
// Global Timer
// ===============================

const timerDisplay   = document.getElementById('timer-display');
const timerMinusBtn  = document.getElementById('timer-minus');
const timerPlusBtn   = document.getElementById('timer-plus');
const timerToggleBtn = document.getElementById('timer-toggle');
const timerResetBtn  = document.getElementById('timer-reset');

let timerSeconds = 0;
let timerRunning = false;
let timerInterval = null;

function renderTimer() {
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
  timerToggleBtn.textContent = timerRunning ? '❚❚' : '▶';
}

function startTimer() {
  if (timerRunning || timerSeconds <= 0) return;
  timerRunning = true;
  renderTimer();

  timerInterval = setInterval(() => {
    timerSeconds--;
    if (timerSeconds <= 0) {
      timerSeconds = 0;
      stopTimer();
    }
    renderTimer();
  }, 1000);
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  renderTimer();
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  renderTimer();
}

timerMinusBtn.onclick = () => {
  timerSeconds = Math.max(0, timerSeconds - 30);
  if (timerSeconds === 0) stopTimer();
  renderTimer();
};

timerPlusBtn.onclick = () => {
  timerSeconds += 30;
  renderTimer();
};

timerToggleBtn.onclick = () => {
  if (!timerRunning) {
    if (timerSeconds <= 0) timerSeconds = 60;
    startTimer();
  } else {
    stopTimer();
  }
};

timerResetBtn.onclick = resetTimer;
renderTimer();

// ===============================
// Persistence
// ===============================

function saveRoutines() {
  localStorage.setItem('lifting_routines', JSON.stringify(routines));
}

function loadRoutines() {
  const raw = localStorage.getItem('lifting_routines');
  if (!raw) return createRoutine();

  try {
    routines = JSON.parse(raw);
  } catch {
    routines = [];
  }

  if (!routines.length) createRoutine();
  routines.forEach(r => createRoutine(r));
}

// ===============================
// Helpers
// ===============================

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ===============================
// Routine UI
// ===============================

function createRoutine(existing) {
  const routine = existing || {
    id: makeId(),
    name: `Routine ${routines.length + 1}`,
    exercises: []
  };

  if (!existing) {
    routines.push(routine);
    saveRoutines();
  }

  const fieldset = document.createElement('fieldset');
  fieldset.className = 'routine';

  const title = document.createElement('h3');
  title.textContent = routine.name;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.type = 'button';
  closeBtn.onclick = () => {
    routines = routines.filter(r => r.id !== routine.id);
    saveRoutines();
    fieldset.remove();
  };

  const list = document.createElement('div');
  list.className = 'routine-list';

  const addBtn = document.createElement('button');
  addBtn.textContent = '+ Add Exercise';
  addBtn.type = 'button';

  const panel = document.createElement('fieldset');
  panel.hidden = true;
  panel.innerHTML = `
    <label>Exercise</label>
    <input class="exercise-name" autocomplete="off">
    <ul class="exercise-suggestions"></ul>
    <button class="save-exercise" type="button">Add</button>
    <button class="cancel-add" type="button">Cancel</button>
  `;

  fieldset.append(title, closeBtn, list, addBtn, panel);
  routinesContainer.appendChild(fieldset);

  const nameInput = panel.querySelector('.exercise-name');
  const suggestions = panel.querySelector('.exercise-suggestions');

  function renderSuggestions(q) {
    suggestions.innerHTML = '';
    if (!q) return;

    exerciseDb
      .filter(e => e.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 5)
      .forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.onclick = () => {
          nameInput.value = name;
          suggestions.innerHTML = '';
          nameInput.focus();
        };
        suggestions.appendChild(li);
      });
  }

  addBtn.onclick = () => {
    panel.hidden = false;
    nameInput.value = '';
    suggestions.innerHTML = '';
    nameInput.focus();
  };

  panel.querySelector('.cancel-add').onclick = () => {
    panel.hidden = true;
  };

  nameInput.addEventListener('input', () =>
    renderSuggestions(nameInput.value.trim())
  );

  panel.querySelector('.save-exercise').onclick = () => {
    const name = nameInput.value.trim();
    if (!name) return alert('Name the exercise');

    routine.exercises.push({
      name,
      history: []
    });

    saveRoutines();
    panel.hidden = true;
    renderExercises();
  };

  function renderExercises() {
    list.innerHTML = '';

    routine.exercises.forEach((ex, i) => {
      const item = document.createElement('div');
      item.className = 'routine-item';

      const last = ex.history.at(-1);
      const label = document.createElement('span');
      label.textContent = last
        ? `${i + 1}. ${ex.name} | Last: ${last.weight}kg × ${last.reps}`
        : `${i + 1}. ${ex.name}`;

      const logBtn = document.createElement('button');
      logBtn.textContent = '+ Log';

      logBtn.onclick = () => {
        item.innerHTML = '';

        const w = document.createElement('input');
        const r = document.createElement('input');
        w.type = r.type = 'number';
        w.placeholder = 'kg';
        r.placeholder = 'reps';

        if (last) {
          w.value = last.weight;
          r.value = last.reps;
        }

        const ok = document.createElement('button');
        ok.textContent = '✔';

        const cancel = document.createElement('button');
        cancel.textContent = '✕';

        ok.onclick = () => {
          ex.history.push({
            date: Date.now(),
            weight: +w.value,
            reps: +r.value
          });
          saveRoutines();
          renderExercises();
        };

        cancel.onclick = renderExercises;

        item.append(w, r, ok, cancel);
        w.focus();
      };

      item.append(label, logBtn);
      list.appendChild(item);
    });
  }

  renderExercises();
}

// ===============================
// Init
// ===============================

addRoutineBtn.onclick = () => {
  createRoutine();
  saveRoutines();
};

loadRoutines();
