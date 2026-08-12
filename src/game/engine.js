import {
  BASE_TICK_MS,
  COLS,
  MAX_QUEUED_TURNS,
  MIN_TICK_MS,
  POINTS_PER_FOOD,
  ROWS,
  SPEEDUP_PER_POINTS,
  SPEEDUP_STEP_MS,
} from './constants';
import { getStage } from './stages';

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const STATUS = {
  ready: 'ready',
  running: 'running',
  paused: 'paused',
  over: 'over',
  won: 'won',
};

export const EVENTS = {
  moved: 'moved',
  ate: 'ate',
  dead: 'dead',
  won: 'won',
};

const same = (a, b) => a.x === b.x && a.y === b.y;
const opposite = (a, b) => a.x === -b.x && a.y === -b.y;
const cellKey = (cell) => `${cell.x},${cell.y}`;

/**
 * Picks a free cell uniformly at random. Enumerating the free cells (rather
 * than retrying random ones until one lands) keeps this bounded when the snake
 * fills most of the board, and lets a full board report itself via null.
 */
export function spawnFood(body, walls = []) {
  const taken = new Set([...body, ...walls].map(cellKey));
  const free = [];

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }

  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)];
}

function startingBody(walls) {
  const wallKeys = new Set(walls.map(cellKey));
  const y = Math.floor(ROWS / 2);
  const candidates = [
    [
      { x: 4, y },
      { x: 3, y },
      { x: 2, y },
    ],
    [
      { x: 5, y: y - 2 },
      { x: 4, y: y - 2 },
      { x: 3, y: y - 2 },
    ],
    [
      { x: 5, y: y + 2 },
      { x: 4, y: y + 2 },
      { x: 3, y: y + 2 },
    ],
  ];

  for (const body of candidates) {
    if (body.every((segment) => !wallKeys.has(cellKey(segment)))) return body;
  }

  // Fallback: first three free cells on the midline.
  const free = [];
  for (let x = 0; x < COLS; x += 1) {
    if (!wallKeys.has(`${x},${y}`)) free.push({ x, y });
    if (free.length >= 3) break;
  }
  return free.length >= 3 ? [free[2], free[1], free[0]] : candidates[0];
}

export function createGame(stageId = 'classic') {
  const stage = getStage(stageId);
  const walls = stage.walls;
  const body = startingBody(walls);

  return {
    body,
    direction: DIRECTIONS.right,
    turns: [],
    food: spawnFood(body, walls),
    walls,
    stageId: stage.id,
    score: 0,
    status: STATUS.ready,
  };
}

/**
 * Buffers a turn for an upcoming tick. Each turn is validated against the last
 * one already queued rather than the direction currently being travelled, so a
 * queued turn can never be followed by one that doubles back into the neck.
 */
export function queueTurn(game, direction) {
  if (game.turns.length >= MAX_QUEUED_TURNS) return game;

  const last = game.turns.length ? game.turns[game.turns.length - 1] : game.direction;
  if (same(direction, last) || opposite(direction, last)) return game;

  return { ...game, turns: [...game.turns, direction] };
}

export function step(game) {
  const turns = game.turns.slice();
  const direction = turns.length ? turns.shift() : game.direction;
  const head = {
    x: game.body[0].x + direction.x,
    y: game.body[0].y + direction.y,
  };
  const walls = game.walls ?? [];

  const died = (reason) => ({
    game: { ...game, direction, turns, status: STATUS.over, cause: reason },
    event: EVENTS.dead,
  });

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    return died('wall');
  }

  if (walls.some((wall) => same(wall, head))) {
    return died('wall');
  }

  const ate = game.food !== null && same(head, game.food);

  // Unless the snake is growing this tick, the tail vacates its cell as the
  // head advances — so moving into it is legal, not a collision.
  const blocking = ate ? game.body : game.body.slice(0, -1);
  if (blocking.some((segment) => same(segment, head))) {
    return died('self');
  }

  const body = [head, ...game.body];
  if (!ate) body.pop();

  const food = ate ? spawnFood(body, walls) : game.food;
  const score = ate ? game.score + POINTS_PER_FOOD : game.score;

  return {
    game: {
      ...game,
      body,
      direction,
      turns,
      food,
      score,
      status: food === null ? STATUS.won : game.status,
    },
    event: food === null ? EVENTS.won : ate ? EVENTS.ate : EVENTS.moved,
  };
}

export function tickInterval(score, difficulty) {
  const base = difficulty?.baseTickMs ?? BASE_TICK_MS;
  const min = difficulty?.minTickMs ?? MIN_TICK_MS;
  const per = difficulty?.speedupPerPoints ?? SPEEDUP_PER_POINTS;
  const stepMs = difficulty?.speedupStepMs ?? SPEEDUP_STEP_MS;
  const steps = Math.floor(score / per);
  return Math.max(min, base - steps * stepMs);
}
