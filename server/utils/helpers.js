/**
 * Utility Helper Functions for CyberNexus Backend
 */

/**
 * Sanitizes input text to prevent simple command or HTML injection parameters.
 * @param {string} text - Raw input string.
 * @returns {string} Sanitized string.
 */
export function sanitizeInput(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Computes level progression based on total XP.
 * Each level requires progressively 1000 additional XP.
 * @param {number} xp - Current XP of the student user.
 * @returns {number} Calculated level.
 */
export function calculateLevelFromXp(xp) {
  if (!xp || xp < 0) return 1;
  // level 1: 0-999, level 2: 1000-1999, etc.
  return Math.floor(xp / 1000) + 1;
}
