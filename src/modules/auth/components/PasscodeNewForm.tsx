import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from '../../../i18n';
import { SecurityCode } from '../../common';

interface PasscodeNewFormProps {
  onSkip?: () => void;
  onSuccess?: (passcode: (string | number)[]) => void;
  onFailure?: () => void;
}

export default function PasscodeNewForm({ onSkip, onSuccess, onFailure }: PasscodeNewFormProps) {
  const { t } = useTranslation();

  const handlePasscodeComplete = async (passcode: (string | number)[]) => {
    // Navigate directly to PasscodeConfirm screen when passcode is entered
    // Pass the passcode to the success callback
    onSuccess?.(passcode);
  };

  return (
    <View style={styles.container}>
      <SecurityCode
        title={t.auth.enterPasscode}
        onPassCodeComplete={handlePasscodeComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999999',
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
  },
  forgetButton: {
    marginBottom: 8,
  },
  button: {
    marginBottom: 15,
  },
});
