import React from 'react';
import { StyleSheet } from 'react-native';
import { ActionButton } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { useSelection } from '../../../contexts';
import { useNavigation } from '@react-navigation/native';

export default function LocationSelection() {
  const { t } = useTranslation();
  const { location } = useSelection();
  const navigation = useNavigation();

  const handlePress = () => {
    try {
      (navigation as any).navigate('SelectLocation');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <ActionButton
      id="location"
      iconName="environment"
      label={t.myPoliticians.location}
      title={location || t.myPoliticians.noLocationSelected}
      onPress={handlePress}
      style={styles.card}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
});


