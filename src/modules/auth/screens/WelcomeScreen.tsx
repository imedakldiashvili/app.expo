import React from 'react';
import { StyleSheet } from 'react-native';
import { AppLogoName, KeyboardAwareView } from '../../common';
import { SafeView } from '../../common';
import { WelcomeForm } from '../components';

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const handleEmailLogin = (email: string) => {
    navigation.navigate('Login', { email });
  };

  const handleEmailRegister = (email: string) => {
    navigation.navigate('RegisterEmailMobile', { email });
  };

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>
      
      <WelcomeForm 
        onEmailLogin={handleEmailLogin}
        onEmailRegister={handleEmailRegister}
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
