import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface DividerProps {
  color?: string;
  thickness?: number;
  style?: ViewStyle;
}

export default function Divider({
  color = '#E2E8F0',
  thickness = 1,
  style,
}: DividerProps) {
  const dividerStyle = [
    styles.divider,
    { backgroundColor: color, height: thickness },
    style,
  ];

  return <View style={dividerStyle} />;
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});
