import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DIRECTIONS } from '../game/engine';
import { COLORS } from '../theme';

const KEYS = {
  up: { glyph: '▲', label: 'Move up' },
  left: { glyph: '◀', label: 'Move left' },
  right: { glyph: '▶', label: 'Move right' },
  down: { glyph: '▼', label: 'Move down' },
};

function Key({ name, onTurn, disabled }) {
  const { glyph, label } = KEYS[name];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => onTurn(DIRECTIONS[name])}
      hitSlop={6}
      style={({ pressed }) => [
        styles.key,
        pressed && !disabled && styles.keyPressed,
        disabled && styles.keyDisabled,
      ]}
    >
      <Text style={styles.glyph}>{glyph}</Text>
    </Pressable>
  );
}

export default function DPad({ onTurn, disabled = false }) {
  return (
    <View style={styles.pad}>
      <Key name="up" onTurn={onTurn} disabled={disabled} />
      <View style={styles.middle}>
        <Key name="left" onTurn={onTurn} disabled={disabled} />
        <View style={styles.hub} />
        <Key name="right" onTurn={onTurn} disabled={disabled} />
      </View>
      <Key name="down" onTurn={onTurn} disabled={disabled} />
    </View>
  );
}

const SIZE = 62;

const styles = StyleSheet.create({
  pad: {
    alignItems: 'center',
    gap: 8,
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  key: {
    width: SIZE,
    height: SIZE,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(18, 28, 46, 0.9)',
  },
  keyPressed: {
    backgroundColor: 'rgba(110, 231, 183, 0.22)',
    borderColor: COLORS.accent,
    transform: [{ scale: 0.95 }],
  },
  keyDisabled: {
    opacity: 0.35,
  },
  hub: {
    width: SIZE,
    height: SIZE,
  },
  glyph: {
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.accent,
  },
});
