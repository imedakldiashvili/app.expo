import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { AntDesign } from '@expo/vector-icons';
import { Text } from '../../../ui';
import { BankAccount as BankAccountType } from '../../../api';

interface BankAccountProps {
  account: BankAccountType;
  onCopy?: (iban: string) => void;
}

export default function BankAccount({ account, onCopy }: BankAccountProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleCopyIban = async (iban: string) => {
    try {
      await Clipboard.setStringAsync(iban);
      setIsCopied(true);
      onCopy?.(iban);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 200);
    } catch (error) {
      console.error('Failed to copy IBAN:', error);
    }
  };

  const getIconColor = () => {
    if (isCopied) return "#007AFF";
    if (isPressed) return "#007AFF";
    return "#9CA3AF";
  };

  const getBorderColor = () => {
    if (isCopied) return "#007AFF";
    if (isPressed) return "#007AFF";
    return "#E5E7EB";
  };

  return (
    <Pressable
      onPress={() => handleCopyIban(account.iban)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        styles.bankAccountContainer,
        { borderColor: getBorderColor() },
        pressed && styles.pressedContainer
      ]}
    >
      <Image
        source={{ uri: account.logo }}
        style={styles.bankLogo}
        resizeMode="contain"
      />
      <View style={styles.ibanContainer}>
        <Text variant="body" color="secondary" style={styles.iban}>
          {account.iban}
        </Text>
      </View>
      <View style={styles.copyButton}>
        <AntDesign 
          name="copy" 
          size={20} 
          color={getIconColor()} 
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bankAccountContainer: {
    marginTop: 6,
    paddingVertical: 6,
    paddingLeft: 0,
    paddingRight: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankLogo: {
    width: 35,
    height: 35,
    marginLeft: 4,
    marginRight: 4,
  },
  ibanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iban: {
    fontFamily: 'monospace',
    textAlign: 'center',
    fontSize: 16,
  },
  copyButton: {
    padding: 4,
    marginLeft: 4,
    pointerEvents: 'none',
  },
  pressedContainer: {
    opacity: 0.8,
  },
});

