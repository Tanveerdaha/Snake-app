import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useEffect, useRef } from 'react';

const SFX = {
  classic: {
    eat: require('../../assets/sounds/sfx_classic_eat.wav'),
    die: require('../../assets/sounds/sfx_classic_die.wav'),
    move: require('../../assets/sounds/sfx_classic_move.wav'),
    start: require('../../assets/sounds/sfx_classic_start.wav'),
  },
  arcade: {
    eat: require('../../assets/sounds/sfx_arcade_eat.wav'),
    die: require('../../assets/sounds/sfx_arcade_die.wav'),
    move: require('../../assets/sounds/sfx_arcade_move.wav'),
    start: require('../../assets/sounds/sfx_arcade_start.wav'),
  },
  retro: {
    eat: require('../../assets/sounds/sfx_retro_eat.wav'),
    die: require('../../assets/sounds/sfx_retro_die.wav'),
    move: require('../../assets/sounds/sfx_retro_move.wav'),
    start: require('../../assets/sounds/sfx_retro_start.wav'),
  },
  soft: {
    eat: require('../../assets/sounds/sfx_soft_eat.wav'),
    die: require('../../assets/sounds/sfx_soft_die.wav'),
    move: require('../../assets/sounds/sfx_soft_move.wav'),
    start: require('../../assets/sounds/sfx_soft_start.wav'),
  },
};

const BGM = {
  chill: require('../../assets/sounds/bgm_chill.wav'),
  pulse: require('../../assets/sounds/bgm_pulse.wav'),
  neon: require('../../assets/sounds/bgm_neon.wav'),
  chip: require('../../assets/sounds/bgm_chip.wav'),
};

function safeRelease(player) {
  try {
    player?.remove?.();
  } catch {
    // ignore
  }
  try {
    player?.release?.();
  } catch {
    // ignore
  }
}

/**
 * Lightweight audio controller. SFX players are created on demand; BGM loops
 * through a single long-lived player that is swapped when the track changes.
 */
export function useGameAudio(settings) {
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const bgmRef = useRef(null);
  const modeReady = useRef(false);

  useEffect(() => {
    let cancelled = false;

    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
    })
      .then(() => {
        if (!cancelled) modeReady.current = true;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      safeRelease(bgmRef.current);
      bgmRef.current = null;
    };
  }, []);

  useEffect(() => {
    const { bgmEnabled, bgmTrack, bgmVolume } = settings;

    const stopBgm = () => {
      const player = bgmRef.current;
      if (!player) return;
      try {
        player.pause();
      } catch {
        // ignore
      }
      safeRelease(player);
      bgmRef.current = null;
    };

    if (!bgmEnabled) {
      stopBgm();
      return;
    }

    const source = BGM[bgmTrack] ?? BGM.chill;
    stopBgm();

    try {
      const player = createAudioPlayer(source);
      player.loop = true;
      player.volume = Math.max(0, Math.min(1, bgmVolume));
      player.play();
      bgmRef.current = player;
    } catch {
      bgmRef.current = null;
    }

    return stopBgm;
  }, [settings.bgmEnabled, settings.bgmTrack]);

  useEffect(() => {
    const player = bgmRef.current;
    if (!player) return;
    try {
      player.volume = Math.max(0, Math.min(1, settings.bgmVolume));
    } catch {
      // ignore
    }
  }, [settings.bgmVolume]);

  const playSfx = (name) => {
    const { sfxEnabled, sfxPack, sfxVolume } = settingsRef.current;
    if (!sfxEnabled) return;

    const pack = SFX[sfxPack] ?? SFX.classic;
    const source = pack[name];
    if (!source) return;

    try {
      const player = createAudioPlayer(source);
      player.volume = Math.max(0, Math.min(1, sfxVolume));
      player.play();
      // Release shortly after the clip finishes.
      setTimeout(() => safeRelease(player), 1500);
    } catch {
      // Audio is optional — never break gameplay.
    }
  };

  return { playSfx };
}
