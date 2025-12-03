import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

const IconContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>
    {children}
  </View>
);

export const ClearIcon = ({ size = 16, color = '#6B7280' }: IconProps) => (
  <IconContainer>
    <AntDesign name="close" size={size} color={color} />
  </IconContainer>
);

export const EyeIcon = ({ size = 18, color = '#6B7280' }: IconProps) => (
  <IconContainer>
    <AntDesign name="eye" size={size} color={color} />
  </IconContainer>
);

export const EyeInvisibleIcon = ({ size = 18, color = '#6B7280' }: IconProps) => (
  <IconContainer>
    <AntDesign name="eye-invisible" size={size} color={color} />
  </IconContainer>
);

export const RefreshIcon = ({ size = 18, color = '#6B7280' }: IconProps) => (
  <IconContainer>
    <AntDesign name="sync" size={size} color={color} />
  </IconContainer>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
});
