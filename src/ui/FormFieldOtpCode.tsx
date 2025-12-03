import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { View, StyleSheet, ViewStyle } from 'react-native';
import InputOtpCode from './InputOtpCode';
import Text from './Text';
import { useTranslation } from '../i18n';

interface FormFieldOtpCodeProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  style?: ViewStyle;
  rules?: any;
  required?: boolean;
  maxLength?: number;
  onRefresh?: () => void;
  countdownDuration?: number;
  OtpContact?: string;
  OtpContactType?: 'email' | 'mobile';
}

export default function FormFieldOtpCode({
  control,
  name,
  label,
  placeholder,
  error,
  style,
  rules,
  required = true,
  maxLength = 6,
  onRefresh,
  countdownDuration = 60,
  OtpContact,
  OtpContactType,
}: FormFieldOtpCodeProps) {
  const { t } = useTranslation();

  // Default OTP validation rules
  const defaultRules = {
    required: required ? t.auth.enterOtpCode : false,
    maxLength: {
      value: maxLength,
      message: `OTP code must be ${maxLength} digits`,
    },
    minLength: {
      value: maxLength,
      message: `OTP code must be ${maxLength} digits`,
    },
    pattern: {
      value: /^\d+$/,
      message: 'OTP code must contain only numbers',
    },
  };

  // Merge default rules with provided rules
  const finalRules = rules ? { ...defaultRules, ...rules } : defaultRules;

  return (
    <Controller
      control={control}
      name={name}
      rules={finalRules}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          <InputOtpCode
            value={value || ''}
            onChangeText={onChange}
            error={error?.message}
            style={style ? { ...styles.input, ...style } : styles.input}
            onRefresh={onRefresh}
            countdownDuration={countdownDuration}
            OtpContact={OtpContact}
            OtpContactType={OtpContactType}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 0,
  },
});
