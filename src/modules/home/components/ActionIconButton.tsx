import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Text } from '../../../ui';
import { colors } from '../../../constants';

interface ActionIconButtonProps {
  icon: string;
  iconColor: string;
  name: string;
  onPress: () => void;
}

export default function ActionIconButton({ 
  icon, 
  iconColor, 
  name, 
  onPress 
}: ActionIconButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconColor + '15' }]}>
        <AntDesign name={icon as any} size={24} color={iconColor} />
      </View>
      <Text variant="body" color="secondary" style={styles.label} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 8,
    paddingBottom: 10,
    minHeight: 90,
    flex: 1,
    minWidth: 70,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});

