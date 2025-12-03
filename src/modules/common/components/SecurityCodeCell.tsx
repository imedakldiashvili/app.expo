import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../../constants/colors';

interface SecurityCodeCellProps {
  i: string ;
  onPress?: (value: string) => void;
  disabled?: boolean;
}

const SecurityCodeCell: React.FC<SecurityCodeCellProps> = ({ i, onPress, disabled = false }) => {
  return (
    <Pressable 
      style={[styles.container, disabled && styles.disabled]} 
      onPress={() => !disabled && onPress?.(i)}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{i}</Text>
    </Pressable>
  );
};

export default SecurityCodeCell;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 5,
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
