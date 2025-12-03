import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppLogo from './AppLogo';
import AppName from './AppName';

interface AppLogoNameProps {
  logoSize?: number;
  containerStyle?: any;
  logoStyle?: any;
  appNameStyle?: any;
}

export default function AppLogoName({ 
  logoSize = 120, 
  containerStyle, 
  logoStyle, 
  appNameStyle 
}: AppLogoNameProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <AppLogo size={logoSize} style={logoStyle} />
      <AppName style={appNameStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
