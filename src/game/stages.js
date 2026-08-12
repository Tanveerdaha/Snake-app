import { COLS, ROWS } from './constants';

const cell = (x, y) => ({ x, y });

function wallsFrom(builder) {
  const walls = [];
  const seen = new Set();
  const add = (x, y) => {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
    const key = `${x},${y}`;
    if (seen.has(key)) return;
    seen.add(key);
    walls.push(cell(x, y));
  };
  builder(add);
  return walls;
}

export const STAGES = [
  {
    id: 'classic',
    name: 'Classic',
    blurb: 'Open field — just you and the apple.',
    walls: [],
  },
  {
    id: 'box',
    name: 'Box',
    blurb: 'An inner frame with side openings.',
    walls: wallsFrom((add) => {
      const midX = Math.floor(COLS / 2);
      const midY = Math.floor(ROWS / 2);
      for (let x = 3; x < COLS - 3; x += 1) {
        if (Math.abs(x - midX) > 1) {
          add(x, 3);
          add(x, ROWS - 4);
        }
      }
      for (let y = 3; y < ROWS - 3; y += 1) {
        if (Math.abs(y - midY) > 1) {
          add(3, y);
          add(COLS - 4, y);
        }
      }
    }),
  },
  {
    id: 'tunnel',
    name: 'Tunnel',
    blurb: 'Side walls force a winding path.',
    walls: wallsFrom((add) => {
      for (let x = 0; x < 8; x += 1) add(x, 6);
      for (let x = 12; x < COLS; x += 1) add(x, 6);
      for (let x = 0; x < 8; x += 1) add(x, 13);
      for (let x = 12; x < COLS; x += 1) add(x, 13);
    }),
  },
  {
    id: 'cross',
    name: 'Cross',
    blurb: 'A plus-shaped barrier splits the board.',
    walls: wallsFrom((add) => {
      const mx = Math.floor(COLS / 2);
      const my = Math.floor(ROWS / 2);
      for (let x = 4; x < COLS - 4; x += 1) {
        if (Math.abs(x - mx) > 1) add(x, my);
      }
      for (let y = 4; y < ROWS - 4; y += 1) {
        if (Math.abs(y - my) > 1) add(mx, y);
      }
    }),
  },
  {
    id: 'maze',
    name: 'Maze',
    blurb: 'Scattered pillars — plan every turn.',
    walls: wallsFrom((add) => {
      [
        [5, 4],
        [5, 5],
        [14, 4],
        [14, 5],
        [5, 14],
        [5, 15],
        [14, 14],
        [14, 15],
        [9, 8],
        [10, 8],
        [9, 11],
        [10, 11],
        [2, 10],
        [3, 10],
        [16, 9],
        [17, 9],
        [8, 2],
        [11, 2],
        [8, 17],
        [11, 17],
      ].forEach(([x, y]) => add(x, y));
    }),
  },
];

export function getStage(id) {
  return STAGES.find((stage) => stage.id === id) ?? STAGES[0];
}
