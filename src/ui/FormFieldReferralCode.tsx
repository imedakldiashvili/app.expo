import React from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import Input from './Input';
import { ViewStyle } from 'react-native';

interface FormFieldReferralCodeProps {
  control: Control<any>;
  name: string;
  error?: FieldError;
  style?: ViewStyle;
  placeholder?: string;
}

export default function FormFieldReferralCode({
  control,
  name,
  error,
  style,
  placeholder = 'რეფერალ კოდი',
}: FormFieldReferralCodeProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: false, // Optional field
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          placeholder={placeholder}
          value={value || ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          mode="text"
          keyboardType="default"
          autoCapitalize="none"
          style={style}
        />
      )}
    />
  );
}

