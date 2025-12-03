import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import Card from './Card';
import Text from './Text';
import { AntDesign } from '@expo/vector-icons';
import { commonStyles } from '../modules/common/styles';

export interface ActionStarButtonProps {
  id: string | number;
  iconName?: React.ComponentProps<typeof AntDesign>['name'];
  iconColor?: string;
  iconSize?: number;
  label?: string;
  title: string;
  value: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: (id: string | number) => void;
  leftContent?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function ActionStarButton({
  id,
  iconName,
  iconColor = '#4B5563',
  iconSize = 20,
  label,
  title,
  value,
  onValueChange,
  onPress,
  leftContent,
  style,
  disabled = false,
}: ActionStarButtonProps) {
  const cardStyle: ViewStyle = style ? { ...styles.card, ...style } : styles.card;

  const cardStyleWithDisabled: ViewStyle = disabled 
    ? StyleSheet.flatten([cardStyle, styles.disabled])
    : cardStyle;

  const labelStyle: TextStyle = disabled
    ? StyleSheet.flatten([commonStyles.labelText, styles.disabledText])
    : commonStyles.labelText;

  const titleStyle: TextStyle = disabled
    ? StyleSheet.flatten([styles.title, styles.disabledText])
    : styles.title;

  const handleStarPress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  const content = (
    <Card style={cardStyleWithDisabled}>
      <View style={styles.row}>
        {(leftContent || iconName) && (
          <View style={styles.leftIcon}>
            {leftContent ? leftContent : iconName ? (
              <AntDesign name={iconName} size={iconSize} color={disabled ? '#9CA3AF' : iconColor} />
            ) : null}
          </View>
        )}
        <View style={styles.info}>
          {label && (
            <Text variant="body" color="secondary" style={labelStyle}>
              {label}
            </Text>
          )}
          <Text variant="body" style={titleStyle}>
            {title}
          </Text>
        </View>
        <View style={styles.starContainer}>
          <TouchableOpacity
            onPress={handleStarPress}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <AntDesign
              name="star"
              size={24}
              color={disabled ? '#9CA3AF' : (value ? '#007AFF' : '#D1D5DB')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable 
      onPress={() => !disabled && onPress?.(id)}
      disabled={disabled}
      style={({ pressed }) => [
        styles.touchable,
        pressed && !disabled && styles.pressed
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchable: {
    opacity: 1,
  },
  pressed: {
    opacity: 0.95,
  },
  card: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  starContainer: {
    marginLeft: 8,
    padding: 4,
  },
  title: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

