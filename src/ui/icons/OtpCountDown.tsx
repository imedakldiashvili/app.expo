import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface OtpCountDownProps {
  duration?: number; // in seconds
  onComplete?: () => void;
}

export default function OtpCountDown({ 
  duration = 60, 
  onComplete 
}: OtpCountDownProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    // Reset countdown when duration changes
    setTimeLeft(duration);
    setHasCompleted(false);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setHasCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [duration]); // Include duration in dependencies

  // Call onComplete when countdown finishes
  useEffect(() => {
    if (hasCompleted && onComplete) {
      onComplete();
    }
  }, [hasCompleted, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCountdownColor = (seconds: number) => {
    if (seconds > 30) {
      return '#00AA00'; // Green - more than 30 seconds left
    } else if (seconds > 10) {
      return '#FFAA00'; // Orange - 10-30 seconds left
    } else {
      return '#FF4444'; // Red - less than 10 seconds left
    }
  };

  return (
    <View style={{ padding: 4 }}>
      <Text style={{ 
        fontSize: 14, // Increased from 12
        color: getCountdownColor(timeLeft), // Dynamic color based on time left
        fontWeight: '500',
        minWidth: 30,
        textAlign: 'center'
      }}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
}
