import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareView, AppLogoName, SafeView } from '../../common';
import { PasscodeNewForm } from '../components';
import { useAuth } from '../../../contexts';

interface PasscodeScreenProps {
  navigation: any;
}

export default function PasscodeNewScreen({ navigation }: PasscodeScreenProps) {
  const { logout } = useAuth();
  const [originalPasscode, setOriginalPasscode] = useState<(string | number)[]>([]);
  
  const handleSkipToHome = () => {
    // Navigate directly to MainTabs (HomeScreen)
    navigation.navigate('MainTabs');
  };

  const handlePasscodeSuccess = (passcode: (string | number)[]) => {
    // Store the original passcode and navigate to PasscodeConfirm screen
    setOriginalPasscode(passcode);
    navigation.navigate('PasscodeConfirm', { originalPasscode: passcode });
  };

  const handlePasscodeFailure = () => {
    // No need to navigate manually
  };

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>

      <PasscodeNewForm 
        onSkip={handleSkipToHome} 
        onSuccess={handlePasscodeSuccess}
        onFailure={handlePasscodeFailure}
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
