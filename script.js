const addExercise   = document.getElementById('add-exercise');

const repNumber     = document.getElementById('rep-number');
const repSetRange   = document.getElementById('rep-set-range');

const repCustom     = document.getElementById('rep-custom'); // the number input
const repRange      = document.getElementById('rep-range');  // the slider
const repRangeValue = document.getElementById('rep-range-value');

const repMin = document.getElementById('rep-min');
const repMax = document.getElementById('rep-max');

function getRepRange() {
    return {
        min: parseInt(repMin.value),
        max: parseInt(repMax.value)
    };
}


// Show the exercise card
addExercise.addEventListener("click", () => {
  document.getElementById("set-exercise").style.display = 'block';
});

// Update UI based on which radio is selected
function updateRepMode() {
  if (repNumber.checked) {
    repCustom.hidden = false;  // show custom reps
    repRange.hidden  = true;   // hide slider
    repMin.hidden = true;
    repMax.hidden = true; 
    if (repRangeValue) repRangeValue.hidden = true;
  } else {
    repCustom.hidden = true;   // hide custom reps
    repRange.hidden  = false;  // show slider
    repMin.hidden = false;
    repMax.hidden = false; 
    if (repRangeValue) repRangeValue.hidden = false;
  }
}

// Keep slider value visible (optional)
function updateRangeValue() {
  if (repRangeValue) repRangeValue.textContent = repRange.value;
}

// Wire up events
repNumber.addEventListener('change', updateRepMode);
repSetRange.addEventListener('change', updateRepMode);
repRange.addEventListener('input', updateRangeValue);

// Initialize correct state on load
updateRepMode();
updateRangeValue();
