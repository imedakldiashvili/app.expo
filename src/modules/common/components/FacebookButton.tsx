import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../../../ui';

interface FacebookButtonProps {
  onPress: () => void;
  style?: any;
}

export default function FacebookButton({ onPress, style }: FacebookButtonProps) {
  return (
    <TouchableOpacity style={[styles.facebookButton, style]} onPress={onPress}>
      <Text style={styles.facebookIcon}>f</Text>
      <Text style={styles.facebookText}>Facebook</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  facebookButton: {
    backgroundColor: '#4267B2',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 12,
  },
  facebookText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
