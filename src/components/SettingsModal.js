import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DIFFICULTIES } from '../game/difficulty';
import { STAGES } from '../game/stages';
import { BGM_TRACKS, SFX_PACKS } from '../settings/defaults';
import { COLORS } from '../theme';
import Button from './Button';

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ChipRow({ options, value, onChange }) {
  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{option.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <Pressable onPress={() => onChange(!value)} style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
      </View>
    </Pressable>
  );
}

function VolumeRow({ label, value, onChange }) {
  const steps = [0, 0.25, 0.5, 0.75, 1];
  return (
    <View style={styles.volumeBlock}>
      <Text style={styles.volumeLabel}>
        {label}: {Math.round(value * 100)}%
      </Text>
      <View style={styles.chips}>
        {steps.map((step) => {
          const active = Math.abs(value - step) < 0.01;
          return (
            <Pressable
              key={step}
              onPress={() => onChange(step)}
              style={[styles.chip, styles.volumeChip, active && styles.chipActive]}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {Math.round(step * 100)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function SettingsModal({ visible, settings, onChange, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Settings</Text>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Section title="Difficulty">
              <ChipRow
                options={DIFFICULTIES}
                value={settings.difficultyId}
                onChange={(difficultyId) => onChange({ difficultyId })}
              />
            </Section>

            <Section title="Stage">
              <ChipRow
                options={STAGES}
                value={settings.stageId}
                onChange={(stageId) => onChange({ stageId })}
              />
              <Text style={styles.hint}>
                {STAGES.find((s) => s.id === settings.stageId)?.blurb}
              </Text>
            </Section>

            <Section title="Game sounds">
              <Toggle
                label="Sound effects"
                value={settings.sfxEnabled}
                onChange={(sfxEnabled) => onChange({ sfxEnabled })}
              />
              <ChipRow
                options={SFX_PACKS}
                value={settings.sfxPack}
                onChange={(sfxPack) => onChange({ sfxPack })}
              />
              <VolumeRow
                label="SFX volume"
                value={settings.sfxVolume}
                onChange={(sfxVolume) => onChange({ sfxVolume })}
              />
            </Section>

            <Section title="Background music">
              <Toggle
                label="Music"
                value={settings.bgmEnabled}
                onChange={(bgmEnabled) => onChange({ bgmEnabled })}
              />
              <ChipRow
                options={BGM_TRACKS}
                value={settings.bgmTrack}
                onChange={(bgmTrack) => onChange({ bgmTrack })}
              />
              <VolumeRow
                label="Music volume"
                value={settings.bgmVolume}
                onChange={(bgmVolume) => onChange({ bgmVolume })}
              />
            </Section>
          </ScrollView>
          <Button label="Done" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(5, 8, 15, 0.72)',
  },
  sheet: {
    maxHeight: '88%',
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgMid,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.accent,
    textAlign: 'center',
    letterSpacing: 1,
  },
  content: {
    gap: 18,
    paddingBottom: 8,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.muted,
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  chipActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(110, 231, 183, 0.18)',
  },
  chipLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: COLORS.accent,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.muted,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    backgroundColor: 'rgba(148, 163, 184, 0.35)',
  },
  toggleTrackOn: {
    backgroundColor: 'rgba(110, 231, 183, 0.45)',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.muted,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.accent,
  },
  volumeBlock: {
    gap: 8,
  },
  volumeLabel: {
    color: COLORS.muted,
    fontSize: 13,
  },
  volumeChip: {
    minWidth: 48,
    alignItems: 'center',
  },
});
