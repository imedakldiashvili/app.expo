import React from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareView, AppLogoName, SafeView } from '../../common';
import { LoginForm } from '../components';

interface LoginScreenProps {
  navigation: any;
  route: any;
}

export default function LoginScreen({ navigation, route }: LoginScreenProps) {
  const email = route?.params?.email || '';
  const handleBackToWelcome = () => {
    navigation.navigate('Welcome');
  };

  const handleLoginSuccess = () => {
    // AppNavigator will automatically show VerificationScreen since user is not verified
    // After verification, it will show PasscodeNew screen
    // No need to navigate manually - AppNavigator handles it based on state
  };

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>

      <LoginForm 
        onBack={handleBackToWelcome} 
        onSuccess={handleLoginSuccess}
        initialEmail={email}
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
