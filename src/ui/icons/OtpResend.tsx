import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { RefreshIcon } from './Icons';

interface OtpResendProps {
  onPress: () => void;
}

export default function OtpResend({ onPress }: OtpResendProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ padding: 4 }}
    >
      <RefreshIcon color="#007AFF" />
    </TouchableOpacity>
  );
}
