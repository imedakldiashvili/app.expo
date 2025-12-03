import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { View, StyleSheet, ViewStyle } from 'react-native';
import InputMobileNumber from './InputMobileNumber';
import { useTranslation } from '../i18n';

interface FormFieldMobileNumberProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  style?: ViewStyle;
  rules?: any;
  required?: boolean;
  editable?: boolean;
}

export default function FormFieldMobileNumber({
  control,
  name,
  label,
  placeholder,
  error,
  style,
  rules,
  required = true,
  editable = true,
}: FormFieldMobileNumberProps) {
  const { t } = useTranslation();

  // Default mobile number validation rules
  const defaultRules = {
    required: required ? t.validation.mobileNumberRequired : false,
    validate: (value: string) => {
      if (!value) return required ? t.validation.mobileNumberRequired : true;
      
      // Simple mobile number format check
      const cleanValue = value.replace(/\s/g, ''); // Remove spaces
      const hasMinLength = cleanValue.length >= 9;
      const hasMaxLength = cleanValue.length <= 15;
      const isNumeric = /^\d+$/.test(cleanValue);
      
      if (!hasMinLength || !hasMaxLength || !isNumeric) {
        return t.validation.mobileNumberInvalid;
      }
      
      return true;
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
          <InputMobileNumber
            value={value || ''}
            onChangeText={onChange}
            error={error?.message}
            style={style ? { ...styles.input, ...style } : styles.input}
            editable={editable}
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
