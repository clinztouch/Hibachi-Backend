import { trapFocus, releaseFocusTrap } from './accessibility.js';
import { authFetch } from './api.js';
import { API_BASE } from './config.js';

const modal = document.getElementById('editHabitModal');
const form = document.getElementById('editHabitForm');
const titleInput = document.getElementById('habitName');
const goalSelect = document.getElementById('habitFrequency');

export function openEditModal(e) {
  const habitId = e.target.dataset.id;
  const habit = window.allHabits?.find(h => h._id === habitId);
  if (!habit) return;

  window.currentEditingHabitId = habitId;
  titleInput.value = habit.title || habit.name || '';
  goalSelect.value = habit.goal || 'daily';

  modal.classList.remove('hidden');
  modal.classList.add('open');
  trapFocus(modal.querySelector('.modal-content'));
}

export function closeEditModal() {
  modal.classList.add('hidden');
  modal.classList.remove('open');
  releaseFocusTrap();
}

export async function submitEditForm(e) {
  e.preventDefault();

  const updatedTitle = titleInput.value.trim();
  const updatedGoal = goalSelect.value;
  const habitId = window.currentEditingHabitId;

  if (!habitId || !updatedTitle) return;

  try {
    const response = await authFetch(`${API_BASE}/api/habits/${habitId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: updatedTitle,
        goal: updatedGoal
      })
    });

    if (!response.ok) {
      console.error('Failed to update habit:', await response.text());
      return;
    }

    closeEditModal();
    if (typeof window.fetchHabits === 'function') {
      await window.fetchHabits(); // Refresh list
    }
  } catch (err) {
    console.error('Error updating habit:', err);
  }
}
