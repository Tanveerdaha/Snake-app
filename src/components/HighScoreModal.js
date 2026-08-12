import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { COLORS } from '../theme';
import Button from './Button';

export default function HighScoreModal({
  visible,
  score,
  knownNames = [],
  defaultName = '',
  onSave,
  onSkip,
}) {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (visible) setName(defaultName);
  }, [visible, defaultName]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onSkip}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>New high score</Text>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.message}>Claim the crown — enter your name or pick one below.</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={COLORS.muted}
            maxLength={16}
            autoCapitalize="words"
            style={styles.input}
          />

          {knownNames.length > 0 && (
            <View style={styles.names}>
              {knownNames.map((known) => (
                <Pressable
                  key={known}
                  onPress={() => setName(known)}
                  style={[styles.nameChip, name === known && styles.nameChipActive]}
                >
                  <Text style={[styles.nameChipLabel, name === known && styles.nameChipLabelActive]}>
                    {known}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <Button label="Save" onPress={() => onSave(name || defaultName || 'Player')} />
            <Button label="Skip" variant="ghost" onPress={onSkip} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(5, 8, 15, 0.88)',
  },
  card: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panelSolid,
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: COLORS.muted,
    fontWeight: '700',
  },
  score: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.accent,
    fontVariant: ['tabular-nums'],
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  names: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  nameChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  nameChipActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(110, 231, 183, 0.18)',
  },
  nameChipLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  nameChipLabelActive: {
    color: COLORS.accent,
  },
  actions: {
    marginTop: 10,
    gap: 10,
    alignItems: 'center',
  },
});
