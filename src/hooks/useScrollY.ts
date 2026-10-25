/**
 * Re-export useScrollY from the unified scrollController.
 * Guarantees a single shared RAF loop and no redundant listeners.
 */
export { useScrollY } from '../lib/scrollController';
