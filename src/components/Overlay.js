import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme';
import Button from './Button';

export default function Overlay({ title, message, actionLabel, onAction, tone = 'accent', children }) {
  return (
    <View style={styles.scrim}>
      <View style={styles.card}>
        <Text style={[styles.title, tone === 'danger' && styles.titleDanger]}>{title}</Text>
        <Text style={[styles.message, children ? styles.messageWithKids : null]}>{message}</Text>
        {children}
        <Button label={actionLabel} onPress={onAction} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    elevation: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.scrim,
    borderRadius: 12,
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panelSolid,
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.accent,
    textAlign: 'center',
  },
  titleDanger: {
    color: COLORS.food,
  },
  message: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
    textAlign: 'center',
  },
  messageWithKids: {
    marginBottom: 10,
  },
});
