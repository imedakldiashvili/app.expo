import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { View, StyleSheet, ViewStyle } from 'react-native';
import InputPasswordConfirm from './InputPasswordConfirm';
import Text from './Text';
import { useTranslation } from '../i18n';

interface FormFieldPasswordConfirmProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  style?: ViewStyle;
  rules?: any;
  required?: boolean;
  minLength?: number;
  watchField?: string; // Field to watch for password confirmation
}

export default function FormFieldPasswordConfirm({
  control,
  name,
  label,
  placeholder,
  error,
  style,
  rules,
  required = true,
  minLength = 6,
  watchField = 'passwordNew',
}: FormFieldPasswordConfirmProps) {
  const { t } = useTranslation();

  // Default password confirmation validation rules
  const defaultRules = {
    required: required ? t.validation.passwordConfirmRequired : false,
    minLength: {
      value: minLength,
      message: t.validation.passwordMinLength.replace('{minLength}', minLength.toString()),
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
          <InputPasswordConfirm
            value={value || ''}
            onChangeText={onChange}
            error={error?.message}
            style={style ? { ...styles.input, ...style } : styles.input}
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
