// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set today's date as default
  const workoutDate = document.getElementById('workoutDate');
  if (workoutDate) {
    workoutDate.valueAsDate = new Date();
  }

  // Load exercises when workout day is selected
  const workoutDay = document.getElementById('workoutDay');
  if (workoutDay) {
    workoutDay.addEventListener('change', function() {
      const day = this.value;
      if (!day) return;

      console.log('Selected day:', day);
      
      const program = JSON.parse(localStorage.getItem('program'));
      console.log('Program from localStorage:', program);
      
      if (!program) {
        console.log('No program found in localStorage');
        const container = document.getElementById('exercisesContainer');
        container.innerHTML = '<p class="no-exercises">No program found. Please add exercises in the program page.</p>';
        return;
      }

      if (!program[day]) {
        console.log('No exercises found for day:', day);
        const container = document.getElementById('exercisesContainer');
        container.innerHTML = '<p class="no-exercises">No exercises found for this day. Please add exercises in the program page.</p>';
        return;
      }

      const exercises = program[day];
      console.log('Exercises for day:', exercises);
      
      if (exercises.length === 0) {
        console.log('Empty exercise list for day:', day);
        const container = document.getElementById('exercisesContainer');
        container.innerHTML = '<p class="no-exercises">No exercises found for this day. Please add exercises in the program page.</p>';
        return;
      }

      const container = document.getElementById('exercisesContainer');
      container.innerHTML = '';

      exercises.forEach((exercise, index) => {
        console.log('Creating exercise element:', exercise);
        
        // Safely handle reps format
        let sets = '';
        let reps = '';
        try {
          const repsParts = exercise.reps.split('x');
          sets = repsParts[0] || '';
          reps = repsParts[1] || '';
        } catch (e) {
          console.error('Error parsing reps:', e);
          sets = '';
          reps = '';
        }

        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-group';
        exerciseDiv.innerHTML = `
          <div class="program-details">
            <h3>${exercise.name || ''}</h3>
            <p>Program: ${exercise.reps || ''} • ${exercise.weight || ''}</p>
            ${exercise.notes ? `<p class="notes">${exercise.notes}</p>` : ''}
          </div>
          <div class="set-group">
            <div class="form-group">
              <label>Sets</label>
              <input type="text" class="form-control" name="sets-${index}" placeholder="e.g. 3" value="${sets}" required>
            </div>
            <div class="form-group">
              <label>Reps</label>
              <input type="text" class="form-control" name="reps-${index}" placeholder="e.g. 12" value="${reps}" required>
            </div>
            <div class="form-group">
              <label>Weight (kg)</label>
              <input type="text" class="form-control" name="weight-${index}" placeholder="e.g. 20kg" value="${exercise.weight || ''}" required>
            </div>
          </div>
        `;
        container.appendChild(exerciseDiv);
      });
    });
  }

  // Load exercises from program when workout type is selected
  const workoutTypeSelect = document.getElementById('workoutType');
  if (workoutTypeSelect) {
    workoutTypeSelect.addEventListener('change', function() {
      const workoutType = this.value;
      if (!workoutType) return;

      console.log('Selected workout type:', workoutType);
      
      const program = JSON.parse(localStorage.getItem('program')) || {};
      console.log('Program from localStorage:', program);
      
      const exercises = program[workoutType] || [];
      console.log('Exercises for this type:', exercises);
      
      const exerciseList = document.querySelector('.exercise-list-items');
      if (exerciseList) {
        exerciseList.innerHTML = ''; // Clear existing exercises

        if (exercises.length === 0) {
          console.log('No exercises found, adding empty exercise');
          addEmptyExercise();
        } else {
          console.log('Adding exercises from program');
          exercises.forEach(exercise => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'exercise-item';
            exerciseItem.innerHTML = `
              <div class="exercise-settings">
                <input type="text" class="exercise-name" placeholder="Exercise name" value="${exercise.name || ''}" required />
                <input type="text" class="exercise-reps" placeholder="reps" value="${exercise.reps || ''}" required />
                <input type="text" class="exercise-weight" placeholder="weight + kgs/lbs" value="${exercise.weight || ''}" required />
                <input type="text" class="exercise-notes" placeholder="Add notes..." value="${exercise.notes || ''}" />
                <button type="button" class="remove-exercise">×</button>
              </div>
            `;
            exerciseList.appendChild(exerciseItem);
          });
        }
      }
    });
  }

  // Add new exercise
  const addExerciseButton = document.querySelector('.add-exercise');
  if (addExerciseButton) {
    addExerciseButton.addEventListener('click', () => {
      addEmptyExercise();
    });
  }

  // Remove exercise
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-exercise')) {
      const exerciseItem = e.target.closest('.exercise-item');
      if (document.querySelectorAll('.exercise-item').length > 1) {
        exerciseItem.remove();
      } else {
        // If it's the last exercise, just clear the inputs
        const inputs = exerciseItem.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
      }
    }
  });

  // Handle form submission
  const workoutForm = document.getElementById('workoutForm');
  if (workoutForm) {
    workoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const workout = {
        date: document.getElementById('workoutDate').value,
        type: document.getElementById('workoutType').value,
        exercises: Array.from(document.querySelectorAll('.exercise-item')).map(item => ({
          name: item.querySelector('.exercise-name').value,
          reps: item.querySelector('.exercise-reps').value,
          weight: item.querySelector('.exercise-weight').value,
          notes: item.querySelector('.exercise-notes').value
        }))
      };

      // Save to localStorage
      const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
      workouts.push(workout);
      localStorage.setItem('workouts', JSON.stringify(workouts));

      // Show toast message
      const toast = document.getElementById('toast');
      if (toast) {
        toast.classList.add('show');
        
        // Hide toast after 2 seconds and redirect to dashboard
        setTimeout(() => {
          toast.classList.remove('show');
          window.location.href = 'dashboard.html';
        }, 2000);
      }
    });
  }
});

// Helper function to add an empty exercise
function addEmptyExercise() {
  const exerciseList = document.querySelector('.exercise-list-items');
  if (exerciseList) {
    const newExercise = document.createElement('div');
    newExercise.className = 'exercise-item';
    newExercise.innerHTML = `
      <div class="exercise-settings">
        <input type="text" class="exercise-name" placeholder="Exercise name" required />
        <input type="text" class="exercise-reps" placeholder="reps" required />
        <input type="text" class="exercise-weight" placeholder="weight + kgs/lbs" required />
        <input type="text" class="exercise-notes" placeholder="Add notes..." />
        <button type="button" class="remove-exercise">×</button>
      </div>
    `;
    exerciseList.appendChild(newExercise);
  }
} 