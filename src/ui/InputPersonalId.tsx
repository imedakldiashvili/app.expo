import React from 'react';
import Input from './Input';
import { useTranslation } from '../i18n';

interface InputPersonalIdProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: any;
  placeholder?: string;
  label?: string;
  editable?: boolean;
}

export default function InputPersonalId({ 
  value, 
  onChangeText, 
  error, 
  style, 
  placeholder,
  label,
  editable = true
}: InputPersonalIdProps) {
  const { t } = useTranslation();

  return (
    <Input
      label={label || t.auth.personalId || 'პირადი ნომერი'}
      placeholder={placeholder || t.auth.personalIdPlaceholder || '00000000000'}
      value={value}
      onChangeText={onChangeText}
      keyboardType="numeric"
      maxLength={11}
      editable={editable}
      error={error}
      style={style}
    />
  );
}

