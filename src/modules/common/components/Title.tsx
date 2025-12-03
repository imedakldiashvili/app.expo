import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { Text } from '../../../ui';

interface TitleProps {
  children: string;
  style?: TextStyle;
}

export default function Title({ children, style }: TitleProps) {
  return (
    <Text variant="h1" style={StyleSheet.flatten([styles.title, style])}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    margin: 5,
  },
});
