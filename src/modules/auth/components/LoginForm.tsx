import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, FormFieldEmail, FormFieldPassword, LoadingSpinner } from '../../../ui';
import { useAuth } from '../../../contexts';
import { useTranslation } from '../../../i18n';
import { Title, BackButton } from '../../common';

interface LoginFormProps {
  onBack: () => void;
  onSuccess?: () => void;
  initialEmail?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm({ onBack, onSuccess, initialEmail = '' }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: initialEmail,
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Use real login function to authenticate user
    const success = await login(data.email, data.password);
    if (success) {
      //Alert.alert(t.common.welcome, t.auth.loginSuccess);
      // Navigate to Passcode screen
      onSuccess?.();
    } else {
      Alert.alert(t.common.welcome, t.auth.loginError);
    }
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  const handleForgetPassword = () => {
    Alert.alert('Forgot Password', 'Password recovery feature coming soon');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner text={t.auth.loggingIn} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      <Title style={styles.title}>{t.auth.login.toUpperCase()}</Title>

      <FormFieldEmail
        control={control}
        name="email"
        error={errors.email}
        style={styles.input}
      />

      <FormFieldPassword
        control={control}
        name="password"
        error={errors.password}
        style={styles.input}
      />
      
      <Button
        title={t.auth.continue}
        variant="primary"
        onPress={handleSubmit(onSubmit, onError)}
        style={styles.button}
      />

      <Button
        title={t.auth.forgetPassword}
        variant="outline"
        onPress={handleForgetPassword}
        style={styles.forgetButton}
      />
            <BackButton onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
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
