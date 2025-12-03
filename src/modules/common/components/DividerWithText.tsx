import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../ui';
import { useTranslation } from '../../../i18n';

interface DividerWithTextProps {
  text?: string;
  style?: any;
}

export default function DividerWithText({ text, style }: DividerWithTextProps) {
  const { t } = useTranslation();
  const displayText = text || t.common.or;

  return (
    <View style={[styles.dividerContainer, style]}>
      <View style={styles.divider} />
      <Text style={styles.dividerText}>{displayText}</Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#A0AEC0',
    fontSize: 14,
  },
});
