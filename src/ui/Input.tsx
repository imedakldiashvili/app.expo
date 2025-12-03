import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import Text from './Text';
import { ClearIcon } from './icons';
import { PasswordIconsLayout, OtpIconsLayout } from './icons';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  mode?: 'text' | 'email' | 'password' | 'mobile-number' | 'otp-code';
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  disabled?: boolean;
  editable?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  rightIcon?: React.ReactNode;
  onOtpRefresh?: () => void; // Callback for OTP refresh
  otpCountdownDuration?: number; // Countdown duration in seconds
  eyeIconColor?: string; // Custom color for eye icons
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  mode = 'text',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  disabled = false,
  editable = true,
  style,
  inputStyle,
  rightIcon,
  onOtpRefresh,
  otpCountdownDuration = 60,
  eyeIconColor,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Determine keyboard type and autoCapitalize based on mode
  const getKeyboardType = () => {
    switch (mode) {
      case 'email':
        return 'email-address';
      case 'mobile-number':
        return 'phone-pad';
      case 'otp-code':
        return 'numeric';
      default:
        return keyboardType;
    }
  };

  const getAutoCapitalize = () => {
    switch (mode) {
      case 'email':
      case 'password':
      case 'mobile-number':
      case 'otp-code':
        return 'none';
      default:
        return autoCapitalize;
    }
  };

  const getSecureTextEntry = () => {
    if (mode === 'password') {
      return !isPasswordVisible;
    }
    return secureTextEntry;
  };

  const getRightIcon = () => {
    if (rightIcon) {
      return rightIcon;
    }

    switch (mode) {
      case 'password':
        return (
          <PasswordIconsLayout
            value={value}
            isPasswordVisible={isPasswordVisible}
            onClear={() => onChangeText('')}
            onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
            eyeIconColor={eyeIconColor}
          />
        );
      case 'otp-code':
        return (
          <OtpIconsLayout
            value={value}
            onClear={() => onChangeText('')}
            onRefresh={onOtpRefresh || (() => {})}
            countdownDuration={otpCountdownDuration}
          />
        );
      default:
        return value.length > 0 && editable && !disabled ? (
          <TouchableOpacity
            style={[styles.clearButton, styles.clearButtonAlone]}
            onPress={() => onChangeText('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ClearIcon />
          </TouchableOpacity>
        ) : null;
    }
  };

  const getInputPadding = () => {
    if (mode === 'password') {
      return { paddingRight: 80 }; // Even more space for password icons
    }
    if (mode === 'otp-code') {
      return { paddingRight: 80 }; // Space for clear + countdown/refresh
    }
    return {}; // Use default padding
  };

  const containerStyle = [
    styles.container,
    error && styles.error,
    disabled && styles.disabled,
    style,
  ];

  const textInputStyle = [
    styles.input,
    isFocused && styles.focused,
    error && styles.error,
    multiline && styles.multiline,
    disabled && styles.disabledInput,
    getInputPadding(), // Dynamic padding based on mode
    inputStyle,
  ];

  return (
    <View style={containerStyle}>
      {label && value.length > 0 && (
        <View style={styles.labelContainer}>
          <Text 
            variant="label" 
            color="secondary"
            style={{
              color: error ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93'
            }}
          >
            {label}
          </Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={textInputStyle}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={getSecureTextEntry()}
          keyboardType={getKeyboardType()}
          autoCapitalize={getAutoCapitalize()}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable && !disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {getRightIcon() && (
          <View style={styles.rightIconContainer}>
            {getRightIcon()}
          </View>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text variant="caption" color="danger" style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    minHeight: 50, // Reserve space 
  },
  labelContainer: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 50, // Default padding for non-password inputs
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  clearButton: {
    position: 'absolute',
    right: 50, // Move clear button to the left of right icon
    top: '50%',
    marginTop: -12, // Adjusted for better centering
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  clearButtonAlone: {
    right: 12, // When there's no right icon, position at the end
  },
  rightIconContainer: {
    position: 'absolute',
    right: 8,
    top: '50%',
    marginTop: -12, // Adjusted for better centering
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  focused: {
    borderColor: '#007AFF',
  },
  error: {
    borderColor: '#FF3B30',
  },
  disabled: {
    opacity: 0.6,
  },
  disabledInput: {
    backgroundColor: '#F8F9FA',
    color: '#8E8E93',
  },
  errorContainer: {
    marginTop: -12,
    marginBottom: -12,
    marginLeft: 12,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 2,
    paddingVertical: 1,
    alignSelf: 'flex-start',
  },
  errorText: {
    // Text styles only
  },
});
