import React, { useState, useEffect, ReactNode } from 'react';
import { View, Keyboard } from 'react-native';

interface KeyboardAwareViewProps {
  children: ReactNode;
  style?: any;
}

export default function KeyboardAwareView({ children, style }: KeyboardAwareViewProps) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

  return <View style={style}>{children}</View>;
}
