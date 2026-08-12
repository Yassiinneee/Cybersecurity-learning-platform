/**
 * JSDoc Type Definitions for CyberNexus Backend Models
 */

/**
 * @typedef {Object} Question
 * @property {string} id - Unique identifier for the question.
 * @property {'mcq' | 'multiple' | 'fill-blank' | 'match' | 'log-analysis'} type - Type of question.
 * @property {string} text - Question statement.
 * @property {string[]} [options] - List of choices.
 * @property {string | string[]} correctAnswer - Answer string or multiple answer keys.
 * @property {string} explanation - Educational explanation of correct options.
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id - Unique identifier.
 * @property {string} title - Lesson title.
 * @property {string} duration - Estimated completion duration.
 * @property {'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'} difficulty - Difficulty tier.
 * @property {number} xpReward - Reward experience points.
 * @property {string[]} learningObjectives - Course objectives.
 * @property {string} readingMaterial - Syllabus in markdown syntax.
 * @property {string} [interactiveDiagramType] - Dynamic visual diagram component ID.
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id - Message unique ID.
 * @property {'user' | 'assistant' | 'system'} sender - Message author role.
 * @property {string} content - Markdown body text.
 * @property {string} timestamp - UTC time of delivery.
 */
export const TypesPlaceholder = true;
