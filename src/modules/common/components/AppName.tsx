import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../../../ui';
import { useTranslation } from '../../../i18n';

interface AppNameProps {
  style?: any;
}

export default function AppName({ style }: AppNameProps) {
  const { t } = useTranslation();

  return (
    <Text variant="h1" style={[styles.appName, style]}>
      {t.app.name}
    </Text>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: '#007AFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28,
  },
});
