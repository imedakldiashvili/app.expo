import React from 'react';
import { StyleSheet } from 'react-native';
import { AppLogoName, KeyboardAwareView } from '../../common';
import { SafeView } from '../../common';
import { OtpValidationForm } from '../components';

interface OtpValidationScreenProps {
  navigation: any;
  route: any;
}

export default function OtpValidationScreen({ navigation, route }: OtpValidationScreenProps) {
  const email = route?.params?.email || '';
  
  const handleBackToWelcome = () => {
    navigation.navigate('Welcome');
  };

  const handleOtpComplete = (otp: string) => {
    // Navigate to RegisterScreen after OTP validation
    navigation.navigate('Register', { email, otp });
  };

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>
      
      <OtpValidationForm 
        onBack={handleBackToWelcome}
        onOtpComplete={handleOtpComplete}
        OtpContact={email}
        OtpContactType="email"
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
