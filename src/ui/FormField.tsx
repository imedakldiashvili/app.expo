import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Input from './Input';
import InputEmail from './InputEmail';
import InputPassword from './InputPassword';
import InputPasswordNew from './InputPasswordNew';
import InputPasswordConfirm from './InputPasswordConfirm';
import Text from './Text';

interface FormFieldProps {
  control: Control<any>;
  name: string;
  type: 'text' | 'email' | 'password' | 'passwordNew' | 'passwordConfirm';
  label?: string;
  placeholder?: string;
  error?: FieldError;
  style?: ViewStyle;
  rules?: any;
}

export default function FormField({
  control,
  name,
  type,
  label,
  placeholder,
  error,
  style,
  rules,
}: FormFieldProps) {
  const renderInput = (value: string, onChangeText: (text: string) => void) => {
    const commonProps = {
      value,
      onChangeText,
      error: error?.message,
      style: style ? { ...styles.input, ...style } : styles.input,
    };

    switch (type) {
      case 'email':
        return <InputEmail {...commonProps} />;
      case 'password':
        return <InputPassword {...commonProps} />;
      case 'passwordNew':
        return <InputPasswordNew {...commonProps} />;
      case 'passwordConfirm':
        return <InputPasswordConfirm {...commonProps} />;
      default:
        return (
          <Input
            label={label}
            placeholder={placeholder}
            error={error?.message}
            value={value}
            onChangeText={onChangeText}
            style={style ? { ...styles.input, ...style } : styles.input}
          />
        );
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          {renderInput(value || '', onChange)}
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
