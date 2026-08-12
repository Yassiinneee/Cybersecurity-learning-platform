/**
 * UserProfile class model.
 * Models a student user profile within the CyberNexus system.
 */
export class UserProfile {
  /**
   * Create a new UserProfile.
   * @param {Object} data - Initial profile properties.
   */
  constructor(data = {}) {
    this.username = data.username || "yassineklt";
    this.role = data.role || "Student";
    this.level = data.level || 1;
    this.xp = data.xp || 0;
    this.streak = data.streak || 3;
    this.lastActiveDate = data.lastActiveDate || new Date().toLocaleDateString();
    this.completedLessons = data.completedLessons || [];
    this.completedLabs = data.completedLabs || [];
    this.solvedCtfs = data.solvedCtfs || [];
    this.unlockedAchievements = data.unlockedAchievements || [];
    this.savedNotes = data.savedNotes || {};
  }

  /**
   * Serializes the user profile to JSON.
   * @returns {Object}
   */
  toJSON() {
    return {
      username: this.username,
      role: this.role,
      level: this.level,
      xp: this.xp,
      streak: this.streak,
      lastActiveDate: this.lastActiveDate,
      completedLessons: this.completedLessons,
      completedLabs: this.completedLabs,
      solvedCtfs: this.solvedCtfs,
      unlockedAchievements: this.unlockedAchievements,
      savedNotes: this.savedNotes
    };
  }
}
