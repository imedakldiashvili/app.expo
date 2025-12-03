import React from 'react';
import Input from './Input';
import { useTranslation } from '../i18n';

interface InputEmailProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: any;
  placeholder?: string;
  label?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}

export default function InputEmail({ 
  value, 
  onChangeText, 
  error, 
  style, 
  placeholder,
  label,
  autoCapitalize = 'none',
  editable = true
}: InputEmailProps) {
  const { t } = useTranslation();

  return (
    <Input
      label={label || t.auth.email}
      placeholder={placeholder || t.auth.emailPlaceholder}
      value={value}
      onChangeText={onChangeText}
      mode="email"
      autoCapitalize={autoCapitalize}
      error={error}
      style={style}
      editable={editable}
    />
  );
}
