import React from 'react';
import Input from './Input';
import { useTranslation } from '../i18n';

interface InputPasswordConfirmProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: any;
  placeholder?: string;
  label?: string;
}

export default function InputPasswordConfirm({ 
  value, 
  onChangeText, 
  error, 
  style, 
  placeholder,
  label 
}: InputPasswordConfirmProps) {
  const { t } = useTranslation();

  return (
    <Input
      label={label || t.auth.passwordConfirm}
      placeholder={placeholder || t.auth.passwordConfirmPlaceholder}
      value={value}
      onChangeText={onChangeText}
      mode="password"
      error={error}
      style={style}
    />
  );
}
