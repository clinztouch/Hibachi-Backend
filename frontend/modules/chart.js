/**
 * Render a bar chart showing daily completion (1 = done, 0 = not done).
 */
export function renderChartForHabit(habit) {
  const canvas = document.getElementById('habitChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const progress = habit.progress || [];
  const data = {
    labels: progress.map(p => p.date),
    datasets: [{
      label: habit.title,
      data: progress.map(p => p.completed ? 1 : 0),
      backgroundColor: '#4caf50'
    }]
  };

  if (window.habitChart instanceof Chart) {
    window.habitChart.destroy();
  }

  window.habitChart = new Chart(ctx, {
    type: 'bar',
    data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

/**
 * Render a 7-day streak chart (line graph).
 */
export function renderStreakChartForHabit(habit) {
  const canvas = document.getElementById('streakChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (window.streakChart instanceof Chart) {
    window.streakChart.destroy();
  }

  const progress = habit.progress || [];
  const { labels, counts } = generateStreakTimeline(progress);

  window.streakChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Completed (1 = Yes, 0 = No)',
        data: counts,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: {
            stepSize: 1,
            callback: val => val === 1 ? '✅' : '❌'
          }
        }
      }
    }
  });
}

/**
 * Generate 7-day timeline from today's date with streak values (0 or 1).
 */
function generateStreakTimeline(progress) {
  const map = {};
  for (const p of progress) {
    map[p.date] = p.completed ? 1 : 0;
  }

  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      value: map[dateStr] || 0
    });
  }

  return {
    labels: result.map(r => r.date),
    counts: result.map(r => r.value)
  };
}
