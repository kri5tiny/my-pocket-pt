// Grab the form element
const form = document.getElementById('workout-form');

// Listen for the form submission
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Stop the form from refreshing the page

  // Grab values from the form
  const date = document.getElementById('date').value;
  const exercise = document.getElementById('exercise').value;
  const sets = document.getElementById('sets').value;
  const reps = document.getElementById('reps').value;
  const weight = document.getElementById('weight').value;

  // Create a workout object
  const workout = {
    date,
    exercise,
    sets,
    reps,
    weight
  };

  // Save to localStorage
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  workouts.push(workout);
  localStorage.setItem('workouts', JSON.stringify(workouts));

  // Show a success message
  alert('Workout saved!');

  // Optionally reset the form
  form.reset();
});
