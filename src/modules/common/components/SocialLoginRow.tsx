import React from 'react';
import { View, StyleSheet } from 'react-native';
import FacebookButton from './FacebookButton';
import GoogleButton from './GoogleButton';

interface SocialLoginRowProps {
  onFacebookPress: () => void;
  onGooglePress: () => void;
}

export default function SocialLoginRow({ onFacebookPress, onGooglePress }: SocialLoginRowProps) {
  return (
    <View style={styles.container}>
      <FacebookButton onPress={onFacebookPress} style={styles.button} />
      <GoogleButton onPress={onGooglePress} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
