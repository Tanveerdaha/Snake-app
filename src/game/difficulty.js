export const DIFFICULTIES = [
  {
    id: 'easy',
    name: 'Easy',
    baseTickMs: 220,
    minTickMs: 110,
    speedupPerPoints: 60,
    speedupStepMs: 6,
  },
  {
    id: 'medium',
    name: 'Medium',
    baseTickMs: 160,
    minTickMs: 70,
    speedupPerPoints: 50,
    speedupStepMs: 8,
  },
  {
    id: 'hard',
    name: 'Hard',
    baseTickMs: 120,
    minTickMs: 55,
    speedupPerPoints: 40,
    speedupStepMs: 8,
  },
  {
    id: 'ultra',
    name: 'Ultra Hard',
    baseTickMs: 90,
    minTickMs: 42,
    speedupPerPoints: 30,
    speedupStepMs: 7,
  },
  {
    id: 'extreme',
    name: 'Extreme',
    baseTickMs: 70,
    minTickMs: 32,
    speedupPerPoints: 20,
    speedupStepMs: 6,
  },
];

export function getDifficulty(id) {
  return DIFFICULTIES.find((item) => item.id === id) ?? DIFFICULTIES[1];
}
