import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme';

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function Hud({ score, best, length, champion }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Stat label="Score" value={score} />
        <Stat label="Best" value={best} />
        <Stat label="Length" value={length} />
      </View>
      {champion?.name ? (
        <Text style={styles.champion} numberOfLines={1}>
          High score dealer · {champion.name} · {champion.score}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  stat: {
    flex: 1,
    maxWidth: 130,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  label: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.muted,
  },
  value: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.accent,
    fontVariant: ['tabular-nums'],
  },
  champion: {
    fontSize: 12,
    color: COLORS.muted,
    letterSpacing: 0.3,
  },
});
