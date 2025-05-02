const container = document.getElementById('history-container');

// Get workouts from localStorage
const workouts = JSON.parse(localStorage.getItem('workouts')) || [];

if (workouts.length === 0) {
  container.innerHTML = "<p>No workouts logged yet</p>";
} else {
  workouts.forEach(workout => {
    const entry = document.createElement('div');
    entry.classList.add('workout-entry');

    entry.innerHTML = `
      <p><strong>Date:</strong> ${workout.date}</p>
      <p><strong>Exercise:</strong> ${workout.exercise}</p>
      <p><strong>Sets x Reps:</strong> ${workout.sets} x ${workout.reps}</p>
      <p><strong>Weight:</strong> ${workout.weight} kg</p>
      <hr/>
    `;

    container.appendChild(entry);
  });
}