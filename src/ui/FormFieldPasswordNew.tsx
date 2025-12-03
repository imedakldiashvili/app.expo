import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { View, StyleSheet, ViewStyle } from 'react-native';
import InputPasswordNew from './InputPasswordNew';
import { useTranslation } from '../i18n';

interface FormFieldPasswordNewProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  style?: ViewStyle;
  rules?: any;
  required?: boolean;
  minLength?: number;
}

export default function FormFieldPasswordNew({
  control,
  name,
  label,
  placeholder,
  error,
  style,
  rules,
  required = true,
  minLength = 6,
}: FormFieldPasswordNewProps) {
  const { t } = useTranslation();

  // Default password validation rules
  const defaultRules = {
    required: required ? t.validation.passwordRequired : false,
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
          <InputPasswordNew
            value={value || ''}
            onChangeText={onChange}
            error={error?.message}
            style={style ? { ...styles.input, ...style } : styles.input}
            label={label}
            placeholder={placeholder}
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
