import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { FormFieldOtpCode, Button, Description } from '../../../ui';
import { Title } from '../../common';
import { useTranslation } from '../../../i18n';
import { colors } from '../../../constants/colors';

interface OtpValidationFormProps {
  onBack: () => void;
  onOtpComplete: (otp: string) => void;
  OtpContact: string;
  OtpContactType: 'email' | 'mobile';
  onRefresh?: () => void;
}

interface OtpFormData {
  otpCode: string;
}

export default function OtpValidationForm({ onBack, onOtpComplete, OtpContact, OtpContactType, onRefresh }: OtpValidationFormProps) {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OtpFormData>({
    defaultValues: {
      otpCode: '',
    },
  });

  // Reset OTP code when contact changes
  useEffect(() => {
    reset({ otpCode: '' });
  }, [OtpContact, reset]);

  const onSubmit = async (data: OtpFormData) => {
    try {
      // Here you would typically validate the OTP with your backend
      // For now, we'll just call the completion handler
      onOtpComplete(data.otpCode);
      
      // Clear the OTP field after submission
      reset({ otpCode: '' });
      
      // Trigger refresh to restart countdown
      if (onRefresh) {
        onRefresh();
        setRefreshKey(prev => prev + 1); // Force countdown restart
      }
    } catch (error) {
      Alert.alert(t.common.welcome, t.auth.otpValidationError || 'Invalid OTP code');
    }
  };

  const onError = (errors: any) => {
    // Form validation errors - handled by UI
  };

  return (
    <View style={styles.container}>
      
      <Title style={styles.title}>
        {t.auth.otpValidation}
      </Title>
      <Description size="medium" style={styles.description}>
        {t.auth.otpCodeSentToContact}
      </Description>
      <Title style={styles.title}>{OtpContact}</Title>
      <FormFieldOtpCode
        key={refreshKey}
        control={control}
        name="otpCode"
        error={errors.otpCode}
        style={styles.input}
        onRefresh={onRefresh}
      />
      
      <Button
        title={t.auth.continue || 'Validate OTP'}
        variant="primary"
        onPress={handleSubmit(onSubmit, onError)}
        style={styles.button}
      />
      
      <Button
        title={t.common.close}
        variant="tertiary"
        onPress={onBack}
        style={styles.backButton}
      />
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
    color: colors.textSecondary,
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginBottom: 15,
  },
  backButton: {
    marginBottom: 15,
  },
});
