import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface AppLogoProps {
  size?: number;
  style?: any;
}

export default function AppLogo({ size = 120, style }: AppLogoProps) {
  return (
    <Image
      source={require('../../../../assets/icon.png')}
      style={[styles.logo, { width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    marginBottom: 20,
  },
});
