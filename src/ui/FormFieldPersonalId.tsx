import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { View, StyleSheet, ViewStyle } from 'react-native';
import InputPersonalId from './InputPersonalId';
import { useTranslation } from '../i18n';

interface FormFieldPersonalIdProps {
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

export default function FormFieldPersonalId({
  control,
  name,
  label,
  placeholder,
  error,
  style,
  rules,
  required = true,
  editable = true,
}: FormFieldPersonalIdProps) {
  const { t } = useTranslation();

  // Default personal ID validation rules
  const defaultRules = {
    required: required ? (t.validation.personalIdRequired || 'პირადი ნომერი აუცილებელია') : false,
    validate: (value: string) => {
      if (!value) return required ? (t.validation.personalIdRequired || 'პირადი ნომერი აუცილებელია') : true;
      
      // Check if value is exactly 11 digits
      const cleanValue = value.replace(/\s/g, ''); // Remove spaces
      const isNumeric = /^\d+$/.test(cleanValue);
      const hasCorrectLength = cleanValue.length === 11;
      
      if (!isNumeric) {
        return t.validation.personalIdInvalid || 'პირადი ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს';
      }
      
      if (!hasCorrectLength) {
        return t.validation.personalIdLength || 'პირადი ნომერი უნდა იყოს 11 ციფრი';
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
          <InputPersonalId
            value={value || ''}
            onChangeText={onChange}
            error={error?.message}
            style={style ? { ...styles.input, ...style } : styles.input}
            editable={editable}
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

