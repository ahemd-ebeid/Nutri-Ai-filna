
export const gamificationService = {
  updateStreak: (): number => {
    const today = new Date().toDateString();
    const lastLoginKey = 'nutriai_last_login';
    const streakKey = 'nutriai_streak';

    const lastDay = localStorage.getItem(lastLoginKey);
    let streak = parseInt(localStorage.getItem(streakKey) || "0");

    if (lastDay !== today) {
        // If last login was yesterday, increment. If older, reset to 1.
        // For simplicity as per V2, we just check inequality for daily update.
        // A more robust check would verify if lastDay was strictly yesterday.
        // Assuming V2 logic: simple increment on new day.
        
        // Simple logic from V2 script:
        streak += 1;
        localStorage.setItem(streakKey, streak.toString());
        localStorage.setItem(lastLoginKey, today);
    }
    return streak;
  },
  
  getStreak: (): number => {
      return parseInt(localStorage.getItem('nutriai_streak') || "0");
  }
};
