import React from 'react';
import Input from './Input';
import { useTranslation } from '../i18n';

interface InputPasswordNewProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: any;
  placeholder?: string;
  label?: string;
}

export default function InputPasswordNew({ 
  value, 
  onChangeText, 
  error, 
  style, 
  placeholder,
  label 
}: InputPasswordNewProps) {
  const { t } = useTranslation();

  return (
    <Input
      label={label || t.auth.passwordNew}
      placeholder={placeholder || t.auth.passwordNewPlaceholder}
      value={value}
      onChangeText={onChangeText}
      mode="password"
      error={error}
      style={style}
    />
  );
}
