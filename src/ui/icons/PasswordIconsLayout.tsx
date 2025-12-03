import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ClearIcon, EyeIcon, EyeInvisibleIcon } from './Icons';

interface PasswordIconsLayoutProps {
  value: string;
  isPasswordVisible: boolean;
  onClear: () => void;
  onToggleVisibility: () => void;
  eyeIconColor?: string;
}

export default function PasswordIconsLayout({
  value,
  isPasswordVisible,
  onClear,
  onToggleVisibility,
  eyeIconColor
}: PasswordIconsLayoutProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', width: 50, justifyContent: 'flex-end', paddingRight: 8 }}>
      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          style={{ padding: 2, marginRight: 2 }}
        >
          <ClearIcon />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={onToggleVisibility}
        style={{ padding: 2 }}
      >
        {isPasswordVisible ? 
          <EyeIcon color={eyeIconColor} /> : 
          <EyeInvisibleIcon color={eyeIconColor} />
        }
      </TouchableOpacity>
    </View>
  );
}
