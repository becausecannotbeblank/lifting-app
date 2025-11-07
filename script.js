// --- Data (for now just in memory) ---

// Existing known exercises (your “database”)
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
];

// Current routine = list of exercise names in order
const routine = [];

// --- Elements ---

const routineList       = document.getElementById('routine-list');
const addExerciseBtn    = document.getElementById('add-exercise');
const panel             = document.getElementById('add-exercise-panel');
const exerciseInput     = document.getElementById('exercise-name');
const suggestionsEl     = document.getElementById('exercise-suggestions');
const saveExerciseBtn   = document.getElementById('save-exercise');
const cancelAddBtn      = document.getElementById('cancel-add');

// --- Helpers ---

function openAddPanel() {
  panel.hidden = false;
  exerciseInput.value = '';
  suggestionsEl.innerHTML = '';
  exerciseInput.focus();
}

function closeAddPanel() {
  panel.hidden = true;
  exerciseInput.value = '';
  suggestionsEl.innerHTML = '';
}

function renderRoutine() {
  routineList.innerHTML = '';

  routine.forEach((name, index) => {
    const item = document.createElement('div');
    item.className = 'routine-item';
    item.textContent = `${index + 1}. ${name}`;
    routineList.appendChild(item);
  });
}

function renderSuggestions(query) {
  if (!query) {
    suggestionsEl.innerHTML = '';
    return;
  }

  const matches = exerciseDb
    .filter(name => name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  suggestionsEl.innerHTML = matches
    .map(name => `<li class="suggestion-item">${name}</li>`)
    .join('');
}

// --- Events ---

addExerciseBtn.addEventListener('click', openAddPanel);

cancelAddBtn.addEventListener('click', closeAddPanel);

exerciseInput.addEventListener('input', () => {
  const query = exerciseInput.value.trim();
  renderSuggestions(query);
});

suggestionsEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('suggestion-item')) {
    exerciseInput.value = e.target.textContent;
    suggestionsEl.innerHTML = '';
    exerciseInput.focus();
  }
});

saveExerciseBtn.addEventListener('click', () => {
  const name = exerciseInput.value.trim();
  if (!name) {
    alert('Name the exercise first.');
    return;
  }

  // If this is a new custom exercise, add it to the DB
  if (!exerciseDb.includes(name)) {
    exerciseDb.push(name);
  }

  // Add to routine
  routine.push(name);
  renderRoutine();
  closeAddPanel();
});
