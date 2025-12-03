import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PasswordStrengthBarProps {
  password: string;
  style?: any;
}

export default function PasswordStrengthBar({ password, style }: PasswordStrengthBarProps) {
  const getPasswordStrength = (password: string): { color: string; score: number } => {
    let score = 0;
    
    // If password is empty, return light gray
    if (password.length === 0) {
      return { color: '#f0f0f0', score: 0 };
    }
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Common patterns (penalties)
    if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 1; // Sequential patterns
    
    if (score <= 2) {
      return { color: '#dc2626', score }; // Dark red
    } else if (score <= 4) {
      return { color: '#fb923c', score }; // Light orange
    } else {
      return { color: '#51cf66', score }; // Green
    }
  };

  const strength = getPasswordStrength(password);
  const showBar = password.length > 0;

  if (!showBar) {
    return <View style={[styles.container, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.strengthBar}>
        {/* Dashed segments */}
        {[1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            style={[
              styles.segment,
              {
                backgroundColor: index <= strength.score 
                  ? strength.color 
                  : '#e8e8e8'
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 6, // Reserve space for strength bar
    marginTop: -8,
    marginBottom: 0,
  },
  strengthBar: {
    height: 3,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -15,
  },
  segment: {
    height: 3,
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 1,
    backgroundColor: '#e8e8e8',
  },
});
