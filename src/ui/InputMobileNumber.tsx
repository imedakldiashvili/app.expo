import React from 'react';
import Input from './Input';
import { useTranslation } from '../i18n';

interface InputMobileNumberProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: any;
  placeholder?: string;
  label?: string;
  editable?: boolean;
}

export default function InputMobileNumber({ 
  value, 
  onChangeText, 
  error, 
  style, 
  placeholder,
  label,
  editable = true
}: InputMobileNumberProps) {
  const { t } = useTranslation();

  return (
    <Input
      label={label || t.auth.mobileNumber}
      placeholder={placeholder || t.auth.mobileNumberPlaceholder}
      value={value}
      onChangeText={onChangeText}
      mode="mobile-number"
      editable={editable}
      error={error}
      style={style}
    />
  );
}
