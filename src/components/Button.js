import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS } from '../theme';

export default function Button({ label, onPress, disabled = false, variant = 'solid' }) {
  const ghost = variant === 'ghost';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        ghost ? styles.ghost : styles.solid,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, ghost && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 116,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: COLORS.accent,
  },
  ghost: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    color: COLORS.onAccent,
    fontSize: 15,
    fontWeight: '700',
  },
  ghostLabel: {
    color: COLORS.text,
  },
});
