// Load saved program from localStorage
function loadProgram() {
  const program = JSON.parse(localStorage.getItem('program')) || {
    push: [
      { name: 'Bench Press', reps: '3x12', weight: '60kg', notes: '' },
      { name: 'Shoulder Press', reps: '3x12', weight: '30kg', notes: '' },
      { name: 'Tricep Extensions', reps: '3x12', weight: '20kg', notes: '' }
    ],
    pull: [
      { name: 'Pull-ups', reps: '3x8', weight: 'Bodyweight', notes: '' },
      { name: 'Rows', reps: '3x12', weight: '40kg', notes: '' },
      { name: 'Bicep Curls', reps: '3x12', weight: '15kg', notes: '' }
    ],
    legs: [
      { name: 'Squats', reps: '3x12', weight: '80kg', notes: '' },
      { name: 'Lunges', reps: '3x12', weight: '20kg', notes: '' },
      { name: 'Calf Raises', reps: '3x15', weight: 'Bodyweight', notes: '' }
    ]
  };

  Object.keys(program).forEach(day => {
    const container = document.querySelector(`#${day} .exercise-list`);
    container.innerHTML = `
      ${program[day].map(exercise => `
        <div class="exercise-item">
          <input type="text" class="exercise-name" value="${exercise.name}" />
          <input type="text" class="exercise-reps" value="${exercise.reps}" />
          <input type="text" class="exercise-weight" value="${exercise.weight}" />
          <input type="text" class="exercise-notes" value="${exercise.notes}" />
          <button class="remove-exercise">×</button>
        </div>
      `).join('')}
    `;
  });
}

// Save entire program
function saveProgram() {
  const program = {
    push: Array.from(document.querySelectorAll('#push .exercise-item')).map(item => ({
      name: item.querySelector('.exercise-name').value,
      reps: item.querySelector('.exercise-reps').value,
      weight: item.querySelector('.exercise-weight').value,
      notes: item.querySelector('.exercise-notes').value
    })),
    pull: Array.from(document.querySelectorAll('#pull .exercise-item')).map(item => ({
      name: item.querySelector('.exercise-name').value,
      reps: item.querySelector('.exercise-reps').value,
      weight: item.querySelector('.exercise-weight').value,
      notes: item.querySelector('.exercise-notes').value
    })),
    legs: Array.from(document.querySelectorAll('#legs .exercise-item')).map(item => ({
      name: item.querySelector('.exercise-name').value,
      reps: item.querySelector('.exercise-reps').value,
      weight: item.querySelector('.exercise-weight').value,
      notes: item.querySelector('.exercise-notes').value
    }))
  };
  localStorage.setItem('program', JSON.stringify(program));
  
  // Show toast message
  const toast = document.getElementById('toast');
  toast.querySelector('.toast-message').textContent = 'Program saved';
  toast.classList.add('show');
  
  // Hide toast after 2 seconds and navigate to dashboard
  setTimeout(() => {
    toast.classList.remove('show');
    window.location.href = 'dashboard.html';
  }, 2000);
}

// Add event listener for Save Program button
document.getElementById('saveProgram').addEventListener('click', saveProgram);

// Add new exercise
document.querySelectorAll('.add-exercise').forEach(button => {
  button.addEventListener('click', () => {
    const container = button.previousElementSibling;
    const newExercise = document.createElement('div');
    newExercise.className = 'exercise-item';
    newExercise.innerHTML = `
      <input type="text" class="exercise-name" placeholder="Exercise name" />
      <input type="text" class="exercise-reps" placeholder="e.g. 3x12" />
      <input type="text" class="exercise-weight" placeholder="e.g. 20kg" />
      <input type="text" class="exercise-notes" placeholder="Add notes..." />
      <button class="remove-exercise">×</button>
    `;
    container.appendChild(newExercise);
  });
});

// Remove exercise
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-exercise')) {
    e.target.parentElement.remove();
  }
});

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

// Load program when page loads
document.addEventListener('DOMContentLoaded', loadProgram); 