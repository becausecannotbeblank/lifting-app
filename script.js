// Simple exercise "database"
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

const addRoutineBtn = document.getElementById('add-routine');
const routinesContainer = document.getElementById('routines');

let routineCount = 0;

function createRoutine() {
  routineCount += 1;
  const routine = [];

  const fieldset = document.createElement('fieldset');
  fieldset.className = 'routine';

  const title = document.createElement('h3');
  title.textContent = `Routine ${routineCount}`;
  fieldset.appendChild(title);

  const list = document.createElement('div');
  list.className = 'routine-list';
  fieldset.appendChild(list);

  const addExerciseBtn = document.createElement('button');
  addExerciseBtn.textContent = '+ Add Exercise';
  addExerciseBtn.type = 'button';
  fieldset.appendChild(addExerciseBtn);

  const panel = document.createElement('fieldset');
  panel.className = 'add-exercise-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div>
      <label>Exercise</label>
      <input type="text" class="exercise-name" placeholder="Start typing..." autocomplete="off">
    </div>
    <ul class="exercise-suggestions"></ul>
    <button type="button" class="save-exercise">Add to Routine</button>
    <button type="button" class="cancel-add">Cancel</button>
  `;
  fieldset.appendChild(panel);

  routinesContainer.appendChild(fieldset);

  const input       = panel.querySelector('.exercise-name');
  const suggestions = panel.querySelector('.exercise-suggestions');
  const saveBtn     = panel.querySelector('.save-exercise');
  const cancelBtn   = panel.querySelector('.cancel-add');

  function renderRoutineList() {
    list.innerHTML = '';
    routine.forEach((name, i) => {
      const item = document.createElement('div');
      item.className = 'routine-item';
      item.textContent = `${i + 1}. ${name}`;
      list.appendChild(item);
    });
  }

  function renderSuggestions(query) {
    if (!query) {
      suggestions.innerHTML = '';
      return;
    }
    const matches = exerciseDb
      .filter(name => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
    suggestions.innerHTML = matches
      .map(name => `<li class="suggestion-item">${name}</li>`)
      .join(''); 
  }

  function openPanel() {
    panel.hidden = false;
    input.value = '';
    suggestions.innerHTML = '';
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
    input.value = '';
    suggestions.innerHTML = '';
  }

  addExerciseBtn.addEventListener('click', openPanel);
  cancelBtn.addEventListener('click', closePanel);

  input.addEventListener('input', () => {
    renderSuggestions(input.value.trim());
  });

  suggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-item')) {
      input.value = e.target.textContent;
      suggestions.innerHTML = '';
      input.focus();
    }
  });

  saveBtn.addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) {
      alert('Name the exercise first.');
      return;
    }
    if (!exerciseDb.includes(name)) {
      exerciseDb.push(name);
    }
    routine.push(name);
    renderRoutineList();
    closePanel();
  });
}

addRoutineBtn.addEventListener('click', createRoutine);

// Start with one routine by default
createRoutine();
