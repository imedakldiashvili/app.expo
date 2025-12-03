import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../../../ui';

interface GoogleButtonProps {
  onPress: () => void;
  style?: any;
}

export default function GoogleButton({ onPress, style }: GoogleButtonProps) {
  return (
    <TouchableOpacity style={[styles.googleButton, style]} onPress={onPress}>
      <Text style={styles.googleIcon}>G</Text>
      <Text style={styles.googleText}>Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#EA4335',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 12,
  },
  googleText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
