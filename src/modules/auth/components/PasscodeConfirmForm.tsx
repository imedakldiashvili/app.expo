import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, LoadingSpinner } from '../../../ui';
import { useAuth, usePasscode } from '../../../contexts';
import { useTranslation } from '../../../i18n';
import { SecurityCode } from '../../common';

interface PasscodeConfirmFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
  originalPasscode: (string | number)[];
}

export default function PasscodeConfirmForm({ onBack, onSuccess, originalPasscode }: PasscodeConfirmFormProps) {
  const { user } = useAuth();
  const { savePasscode } = usePasscode();
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handlePasscodeComplete = async (passcode: (string | number)[]) => {
    setErrors({});
    setIsLoading(true);
    
    try {
      // Check if passcode matches the original passcode from PasscodeNewScreen
      const passcodeString = passcode.join('');
      const originalPasscodeString = originalPasscode.join('');
      
      if (passcodeString !== originalPasscodeString) {
        setIsLoading(false);
        setErrors({ passcode: 'Passcodes do not match' });
        Alert.alert('Error', t.auth.passcodeMismatch);
        // Navigate back to PasscodeNewScreen
        onBack?.();
        return;
      }
      
      // Save passcode using PasscodeContext with user info
      const userInfo = user ? { id: user.id, email: user.email } : undefined;
      const saved = await savePasscode(passcodeString, userInfo);
      
      setIsLoading(false);
      
      if (saved) {
        //Alert.alert(t.common.welcome, t.auth.passcodeSaved);
        // Navigate to Home screen (MainTabs) - AppNavigator will handle this automatically
        onSuccess?.();
      } else {
        Alert.alert('Error', 'Failed to save passcode');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save passcode');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner text={t.auth.savingPasscode} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SecurityCode
        title={t.auth.confirmPasscode}
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
  button: {
    marginBottom: 15,
  },
});
