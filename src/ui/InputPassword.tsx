import React from 'react';
import Input from './Input';
import { useTranslation } from '../i18n';

interface InputPasswordProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: any;
  placeholder?: string;
  label?: string;
}

export default function InputPassword({ 
  value, 
  onChangeText, 
  error, 
  style, 
  placeholder,
  label 
}: InputPasswordProps) {
  const { t } = useTranslation();

  return (
    <Input
      label={label || t.auth.password}
      placeholder={placeholder || t.auth.passwordPlaceholder}
      value={value}
      onChangeText={onChangeText}
      mode="password"
      error={error}
      style={style}
    />
  );
}
