import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
  children: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  backgroundColor?: string;
  center?: boolean;
  style?: ViewStyle;
}

export default function Container({
  children,
  padding = 'medium',
  backgroundColor = '#FFFFFF',
  center = false,
  style,
}: ContainerProps) {
  const containerStyle = [
    styles.container,
    styles[padding],
    { backgroundColor },
    center && styles.center,
    style,
  ];

  return (
    <SafeAreaView style={containerStyle}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  none: {
    padding: 0,
  },
  small: {
    padding: 16,
  },
  medium: {
    padding: 24,
  },
  large: {
    padding: 32,
  },
});
