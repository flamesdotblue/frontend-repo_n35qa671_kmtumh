// Simple localStorage persistence for progress
const KEY = "promptquest-progress";

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { points: 0, streak: 0, completed: {}, lastPlayed: null };
    const parsed = JSON.parse(raw);
    return {
      points: parsed.points || 0,
      streak: parsed.streak || 0,
      completed: parsed.completed || {},
      lastPlayed: parsed.lastPlayed || null,
    };
  } catch {
    return { points: 0, streak: 0, completed: {}, lastPlayed: null };
  }
}

export function saveProgress(progress) {
  const safe = {
    points: progress.points || 0,
    streak: progress.streak || 0,
    completed: progress.completed || {},
    lastPlayed: progress.lastPlayed || null,
  };
  localStorage.setItem(KEY, JSON.stringify(safe));
}

export function updateDailyStreak(progress) {
  const today = new Date().toDateString();
  if (!progress.lastPlayed) {
    progress.streak = 1;
  } else if (progress.lastPlayed !== today) {
    // New day; streak +1 if yesterday, else reset to 1
    const last = new Date(progress.lastPlayed);
    const diffDays = Math.floor(
      (new Date(today).getTime() - new Date(last.toDateString()).getTime()) / (1000 * 60 * 60 * 24)
    );
    progress.streak = diffDays === 1 ? (progress.streak || 0) + 1 : 1;
  }
  progress.lastPlayed = today;
  return progress;
}
