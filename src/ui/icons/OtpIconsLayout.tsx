import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ClearIcon } from './Icons';
import OtpCountDown from './OtpCountDown';
import OtpResend from './OtpResend';

interface OtpIconsLayoutProps {
  value: string;
  onClear: () => void;
  onRefresh: () => void;
  countdownDuration?: number; // in seconds
}

export default function OtpIconsLayout({
  value,
  onClear,
  onRefresh,
  countdownDuration = 60
}: OtpIconsLayoutProps) {
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownKey, setCountdownKey] = useState(0);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
  };

  const handleResend = () => {
    onRefresh();
    setShowCountdown(true);
    setCountdownKey(prev => prev + 1); // Force restart
  };

  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      width: 80, 
      justifyContent: 'flex-end', 
      paddingRight: 8 
    }}>
      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          style={{ padding: 4, marginRight: 4 }}
        >
          <ClearIcon />
        </TouchableOpacity>
      )}
      
      {showCountdown ? (
        <OtpCountDown 
          key={countdownKey}
          duration={countdownDuration}
          onComplete={handleCountdownComplete}
        />
      ) : (
        <OtpResend onPress={handleResend} />
      )}
    </View>
  );
}
