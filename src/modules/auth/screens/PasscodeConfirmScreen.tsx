import React from 'react';
import { StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareView, AppLogoName, SafeView } from '../../common';
import { PasscodeConfirmForm } from '../components';
import { useAuth } from '../../../contexts';

interface PasscodeConfirmScreenProps {
  navigation: any;
}

export default function PasscodeConfirmScreen({ navigation }: PasscodeConfirmScreenProps) {
  const { logout } = useAuth();
  const route = useRoute();
  
  const handleBackToPasscode = () => {
    // Navigate back to previous screen (PasscodeNew)
    navigation.goBack();
  };

  const handlePasscodeConfirmSuccess = () => {
    // AppNavigator will automatically show MainTabs when isPasscodeValid becomes true
    // No need to navigate manually
  };

  // Get originalPasscode from navigation params
  const originalPasscode = (route.params as any)?.originalPasscode || [];

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>

      <PasscodeConfirmForm 
        onBack={handleBackToPasscode} 
        onSuccess={handlePasscodeConfirmSuccess}
        originalPasscode={originalPasscode}
      />
    </SafeView>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
