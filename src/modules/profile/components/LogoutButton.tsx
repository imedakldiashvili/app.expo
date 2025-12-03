import React from 'react';
import { Alert } from 'react-native';
import { Button } from '../../../ui';
import { useTranslation } from '../../../i18n';

interface LogoutButtonProps {
  onLogout: () => Promise<void>;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { t } = useTranslation();

  const handleLogout = () => {
    Alert.alert(
      t.auth.logoutTitle,
      t.auth.logoutConfirm,
      [
        { text: t.common.cancel, style: 'cancel' },
        { text: t.common.confirm, onPress: async () => await onLogout() },
      ]
    );
  };

  return (
    <Button
      title={t.auth.logout}
      variant="danger"
      onPress={handleLogout}
      style={styles.logoutButton}
    />
  );
}

const styles = {
  logoutButton: {
    marginTop: 20,
  },
};
