import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { colors } from '../constants/colors';

interface DescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  align?: 'left' | 'center' | 'right';
}

export default function Description({ 
  children, 
  style, 
  color = colors.textSecondary,
  size = 'medium',
  align = 'center'
}: DescriptionProps) {
  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  const alignStyles = {
    left: styles.left,
    center: styles.center,
    right: styles.right,
  };

  return (
    <Text 
      style={[
        styles.base,
        sizeStyles[size],
        alignStyles[align],
        { color },
        style
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '400',
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
  },
  medium: {
    fontSize: 14,
  },
  large: {
    fontSize: 16,
  },
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});
