import React from 'react';
import Input from './Input';
import Text from './Text';
import { useTranslation } from '../i18n';

interface InputOtpCodeProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: any;
  placeholder?: string;
  label?: string;
  onRefresh?: () => void;
  countdownDuration?: number;
  OtpContact?: string;
  OtpContactType?: 'email' | 'mobile';
}

export default function InputOtpCode({ 
  value, 
  onChangeText, 
  error, 
  style, 
  placeholder,
  label,
  onRefresh,
  countdownDuration = 60,
  OtpContact,
  OtpContactType
}: InputOtpCodeProps) {
  const { t } = useTranslation();

  // Props are received but not used in Input component
  // They're kept for future display purposes

  return (
    <Input
      label={label || t.auth.enterOtpCode}
      placeholder={placeholder || t.auth.enterOtpCode}
      value={value}
      onChangeText={onChangeText}
      mode="otp-code"
      maxLength={6}
      error={error}
      style={style}
      onOtpRefresh={onRefresh}
      otpCountdownDuration={countdownDuration}
    />
  );
}
