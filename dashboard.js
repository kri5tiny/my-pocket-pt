// Load saved workouts from localStorage
function loadWorkouts() {
  const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
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

  // Display exercise lists
  displayExerciseList('push', program.push);
  displayExerciseList('pull', program.pull);
  displayExerciseList('legs', program.legs);

  // Display workout history
  const pushExercises = workouts.filter(w => w.type === 'push');
  const pullExercises = workouts.filter(w => w.type === 'pull');
  const legExercises = workouts.filter(w => w.type === 'legs');

  displayExercises('push', pushExercises);
  displayExercises('pull', pullExercises);
  displayExercises('legs', legExercises);

  // Update calendar
  updateCalendar(workouts);
}

// Display exercise list for a specific day
function displayExerciseList(day, exercises) {
  const container = document.querySelector(`#${day} .exercise-list`);
  const listContainer = document.createElement('div');
  listContainer.className = 'exercise-list-container';
  
  listContainer.innerHTML = `
    <h3>Exercises</h3>
    <ul class="exercise-list-items">
      ${exercises.map(ex => `
        <li>
          <strong>${ex.name}</strong>
          <span>${ex.reps} • ${ex.weight}</span>
          ${ex.notes ? `<p class="notes">${ex.notes}</p>` : ''}
        </li>
      `).join('')}
    </ul>
  `;
  
  container.insertBefore(listContainer, container.firstChild);
}

// Display exercises for a specific day
function displayExercises(day, exercises) {
  const container = document.querySelector(`#${day} .exercise-list`);
  const historyContainer = document.createElement('div');
  historyContainer.className = 'workout-history';
  
  if (exercises.length > 0) {
    // Group exercises by date
    const exercisesByDate = exercises.reduce((acc, exercise) => {
      if (!acc[exercise.date]) {
        acc[exercise.date] = [];
      }
      acc[exercise.date].push(exercise);
      return acc;
    }, {});

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(exercisesByDate).sort((a, b) => new Date(b) - new Date(a));

    historyContainer.innerHTML = `
      <h3>Workout History</h3>
      <div class="history-content">
        ${sortedDates.map(date => {
          const dateExercises = exercisesByDate[date];
          const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          return `
            <div class="workout-day">
              <div class="workout-day-header">
                <h4>${formattedDate}</h4>
                <button class="toggle-day">▼</button>
              </div>
              <div class="workout-day-content">
                <div class="workout-summary">
                  <p>Total Exercises: ${dateExercises.length}</p>
                  <p>Total Sets: ${dateExercises.reduce((sum, ex) => sum + parseInt(ex.sets), 0)}</p>
                </div>
                <div class="exercise-cards">
                  ${dateExercises.map(ex => `
                    <div class="exercise-card">
                      <h5>${ex.name}</h5>
                      <div class="exercise-details">
                        <p><strong>Sets:</strong> ${ex.sets}</p>
                        <p><strong>Reps:</strong> ${ex.reps}</p>
                        <p><strong>Weight:</strong> ${ex.weight}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    historyContainer.innerHTML = '<p class="no-history">No workout history yet</p>';
  }
  
  container.appendChild(historyContainer);

  // Add toggle functionality for workout days
  const workoutDays = historyContainer.querySelectorAll('.workout-day');
  workoutDays.forEach(day => {
    const header = day.querySelector('.workout-day-header');
    const content = day.querySelector('.workout-day-content');
    const toggleButton = header.querySelector('.toggle-day');
    
    header.addEventListener('click', () => {
      const isExpanded = content.style.display !== 'none';
      content.style.display = isExpanded ? 'none' : 'block';
      toggleButton.textContent = isExpanded ? '▶' : '▼';
    });
  });
}

// Update calendar with workout days
function updateCalendar(workouts) {
  const calendarDays = document.getElementById('calendarDays');
  const today = new Date();
  
  // Get 3 days before and 3 days after today
  let calendarHTML = '';
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayWorkouts = workouts.filter(w => w.date === dateStr);
    const workoutDay = dayWorkouts.length > 0 ? dayWorkouts[0].type : '';
    
    let dayClass = 'calendar-day';
    if (workoutDay === 'push') dayClass += ' push-day';
    if (workoutDay === 'pull') dayClass += ' pull-day';
    if (workoutDay === 'legs') dayClass += ' legs-day';
    if (i === 0) dayClass += ' today';
    
    calendarHTML += `
      <div class="${dayClass}">
        <div class="day-number">${date.getDate()}</div>
        <div class="day-name">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
        ${workoutDay ? `<div class="workout-type">${workoutDay}</div>` : ''}
      </div>
    `;
  }
  
  calendarDays.innerHTML = calendarHTML;
}

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

// Load workouts when page loads
document.addEventListener('DOMContentLoaded', loadWorkouts); 