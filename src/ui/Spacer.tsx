import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  horizontal?: boolean;
  style?: ViewStyle;
}

export default function Spacer({
  size = 'md',
  horizontal = false,
  style,
}: SpacerProps) {
  const spacerStyle = [
    horizontal ? styles.horizontal : styles.vertical,
    styles[size],
    style,
  ];

  return <View style={spacerStyle} />;
}

const styles = StyleSheet.create({
  vertical: {
    height: 0,
  },
  horizontal: {
    width: 0,
  },
  xs: {
    height: 4,
    width: 4,
  },
  sm: {
    height: 8,
    width: 8,
  },
  md: {
    height: 16,
    width: 16,
  },
  lg: {
    height: 24,
    width: 24,
  },
  xl: {
    height: 32,
    width: 32,
  },
  xxl: {
    height: 48,
    width: 48,
  },
});
