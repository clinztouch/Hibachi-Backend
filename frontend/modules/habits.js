import { authFetch } from './api.js';
import { onHabitChange } from '../hibachiApp.js';
import { API_BASE } from './config.js';

/**
 * Fetch all habits and render them.
 */
export async function fetchHabits() {
  try {
    const res = await authFetch(`${API_BASE}/api/habits`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to fetch habits');

    window.allHabits = data;
    renderHabitList(data);
    onHabitChange();
  } catch (err) {
    console.error('❌ fetchHabits error:', err);
    alert('Failed to load habits.');
  }
}

/**
 * Mark a habit as completed for a specific date.
 */
export async function markHabitDone(habitId, date) {
  return authFetch(`${API_BASE}/api/habits/${habitId}/completions`, {
    method: 'POST',
    body: JSON.stringify({ date }),
  });
}

/**
 * Remove a completion entry from a habit.
 */
export async function unmarkHabitDone(habitId, date) {
  return authFetch(`${API_BASE}/api/habits/${habitId}/completions`, {
    method: 'DELETE',
    body: JSON.stringify({ date }),
  });
}

/**
 * Mark a habit as done using PATCH.
 */
export async function markHabit(id) {
  try {
    const res = await authFetch(`${API_BASE}/api/habits/${id}/mark`, {
      method: 'PATCH',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not mark habit');

    await fetchHabits();
  } catch (err) {
    console.error('❌ markHabit error:', err);
    alert(err.message);
  }
}

/**
 * Edit a habit’s title and goal.
 */
export async function editHabit(id, updatedTitle, updatedGoal) {
  try {
    const res = await authFetch(`${API_BASE}/api/habits/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: updatedTitle, goal: updatedGoal })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Edit failed');

    await fetchHabits();
  } catch (err) {
    console.error('❌ editHabit error:', err);
    alert(err.message);
  }
}

/**
 * Delete a habit by ID.
 */
export async function deleteHabit(id) {
  if (!confirm('Delete this habit?')) return;

  try {
    const res = await authFetch(`${API_BASE}/api/habits/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Could not delete habit');

    await fetchHabits();
  } catch (err) {
    console.error('❌ deleteHabit error:', err);
    alert(err.message);
  }
}

/**
 * Render the list of habits with checkboxes and action buttons.
 */
function renderHabitList(habits) {
  const list = document.getElementById('habitList');
  list.innerHTML = '';

  habits.forEach(habit => {
    const habitItem = document.createElement('div');
    habitItem.className = 'habit-item';
    habitItem.innerHTML = `
      <div class="habit-title">${habit.title}</div>
      <div class="habit-description">${habit.goal}</div>
      <div class="habit-actions">
        <label>
          <input type="checkbox" class="complete-toggle" data-id="${habit._id}" ${isHabitDoneToday(habit) ? 'checked' : ''}>
          Mark as done today
        </label>
        <button class="btn btn-secondary edit-habit-btn" data-id="${habit._id}">Edit</button>
        <button class="btn btn-danger delete-habit-btn" data-id="${habit._id}">Delete</button>
      </div>
    `;
    list.appendChild(habitItem);
  });
}

/**
 * Utility: Check if habit is done today.
 */
function isHabitDoneToday(habit) {
  const today = new Date().toISOString().slice(0, 10);
  return habit.completions?.includes(today);
}
