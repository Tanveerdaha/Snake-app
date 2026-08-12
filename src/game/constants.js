export const COLS = 20;
export const ROWS = 20;

// Defaults used when difficulty config is unavailable.
export const BASE_TICK_MS = 160;
export const MIN_TICK_MS = 70;
export const SPEEDUP_PER_POINTS = 50;
export const SPEEDUP_STEP_MS = 8;

export const POINTS_PER_FOOD = 10;

// How many turns may be buffered ahead of the next tick. Two lets a quick
// right-then-up flick register both moves instead of dropping the second.
export const MAX_QUEUED_TURNS = 2;

// Finger travel (in px) needed before a drag counts as a swipe.
export const SWIPE_THRESHOLD = 20;

export { STORAGE_KEY } from '../settings/defaults';
