import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'muted' | 'white' | 'danger' | 'success';
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  style?: TextStyle;
  numberOfLines?: number;
}

export default function Text({
  children,
  variant = 'body',
  color = 'primary',
  align = 'left',
  weight = 'normal',
  style,
  numberOfLines,
}: TextProps) {
  const textStyle = [
    styles.text,
    styles[variant],
    styles[color],
    styles[align],
    styles[weight],
    style,
  ];

  return <RNText style={textStyle} numberOfLines={numberOfLines}>{children}</RNText>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System',
  },
  
  // Variants
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'none', // Prevent automatic capitalization
  },
  
  // Colors
  primary: {
    color: '#333333',
  },
  secondary: {
    color: '#666666',
  },
  muted: {
    color: '#8E8E93',
  },
  white: {
    color: '#FFFFFF',
  },
  danger: {
    color: '#FF3B30',
  },
  success: {
    color: '#34C759',
  },
  
  // Alignment
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  
  // Weight
  normal: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
});
