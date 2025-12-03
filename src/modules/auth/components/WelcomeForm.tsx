import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, FormFieldEmail } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { SocialLoginRow, DividerWithText, LanguageSwitcher, Title } from '../../common';

interface WelcomeFormProps {
  onEmailLogin: (email: string) => void;
  onEmailRegister: (email: string) => void;
}

interface WelcomeFormData {
  email: string;
}

export default function WelcomeForm({ onEmailLogin, onEmailRegister }: WelcomeFormProps) {
  const { t } = useTranslation();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WelcomeFormData>({
    defaultValues: {
      email: '',
    },
  });

  const handleFacebookLogin = () => {
    Alert.alert('Facebook', t.auth.facebookAuth);
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google', t.auth.googleAuth);
  };

  const handleEmailAuthorization = (data: WelcomeFormData) => {
    const email = data.email.toLowerCase().trim();
    
    // Check if email starts with 'a'
    if (email.startsWith('a')) {
      // Navigate to LoginScreen with email
      onEmailLogin(email);
    } else {
      // Navigate directly to RegisterScreen with email
      onEmailRegister(email);
    }
  };

  const handleLogin = (data: WelcomeFormData) => {
    const email = data.email.toLowerCase().trim();
    onEmailLogin(email);
  };

  const handleRegister = (data: WelcomeFormData) => {
    const email = data.email.toLowerCase().trim();
    onEmailRegister(email);
  };

  return (
    <View style={styles.container}>
      <SocialLoginRow 
        onFacebookPress={handleFacebookLogin}
        onGooglePress={handleGoogleLogin}
      />
      <DividerWithText />
      <Title style={styles.title}>{t.auth.emailLogin.toUpperCase()}</Title>
      <Button
        title={t.auth.login}
        variant="primary"
        onPress={handleSubmit(handleLogin)}
        style={styles.button}
      />

<Button title={t.auth.register}
        
        variant="outline"
        onPress={handleSubmit(handleRegister)}
        style={styles.button}
      />
   

      <LanguageSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  button: {
    marginBottom: 15,
  },
  emailInput: {
    marginBottom: 15,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#999999",
    marginBottom: 20,
  },
});