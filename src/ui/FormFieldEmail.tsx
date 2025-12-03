import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { View, StyleSheet, ViewStyle } from 'react-native';
import InputEmail from './InputEmail';
import Text from './Text';
import { useTranslation } from '../i18n';

interface FormFieldEmailProps {
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

export default function FormFieldEmail({
  control,
  name,
  label,
  placeholder,
  error,
  style,
  rules,
  required = true,
  editable = true,
}: FormFieldEmailProps) {
  const { t } = useTranslation();

  // Default email validation rules
  const defaultRules = {
    required: required ? t.validation.emailRequired : false,
    validate: (value: string) => {
      if (!value) return required ? t.validation.emailRequired : true;
      
      // Simple email format check
      const hasAt = value.includes('@');
      const hasDot = value.includes('.');
      const hasTextBeforeAt = value.split('@')[0]?.length > 0;
      const hasTextAfterAt = value.split('@')[1]?.length > 0;
      
      if (!hasAt || !hasDot || !hasTextBeforeAt || !hasTextAfterAt) {
        return t.validation.emailInvalid;
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
          <InputEmail
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
