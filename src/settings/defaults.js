export const SFX_PACKS = [
  { id: 'classic', name: 'Classic' },
  { id: 'arcade', name: 'Arcade' },
  { id: 'retro', name: 'Retro' },
  { id: 'soft', name: 'Soft' },
];

export const BGM_TRACKS = [
  { id: 'chill', name: 'Chill' },
  { id: 'pulse', name: 'Pulse' },
  { id: 'neon', name: 'Neon' },
  { id: 'chip', name: 'Chip' },
];

export const DEFAULT_SETTINGS = {
  sfxEnabled: true,
  sfxPack: 'classic',
  sfxVolume: 0.7,
  bgmEnabled: true,
  bgmTrack: 'chill',
  bgmVolume: 0.35,
  stageId: 'classic',
  difficultyId: 'medium',
  playerName: '',
  knownNames: [],
};

export const SETTINGS_KEY = 'snake-cursor-settings';
export const CHAMPION_KEY = 'snake-cursor-champion';
export const STORAGE_KEY = 'snake-cursor-high-score';
