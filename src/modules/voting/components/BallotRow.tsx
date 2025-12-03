import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Card } from '../../../ui';
import { AntDesign } from '@expo/vector-icons';
import { commonStyles } from '../../common';

interface BallotRowProps {
  ballot: {
    id: number;
    name: string;
    description?: string;
  };
  label?: string;
  selectedImages?: Array<{
    id: string | number;
    image: string;
    position?: number;
  }>;
  selectionType?: 'accept' | 'decline';
  onPress?: () => void;
}

export default function BallotRow({
  ballot,
  label,
  selectedImages = [],
  selectionType,
  onPress,
}: BallotRowProps) {
  const sortedImages = [...selectedImages].sort(
    (a, b) => (a.position || 0) - (b.position || 0)
  );

  const content = (
    <Card style={styles.ballotRow} shadow={false}>
      <View style={styles.row}>
        <View style={styles.content}>
          <Text variant="caption" style={commonStyles.nameText}>{ballot.name}</Text>

          {selectionType !== 'accept' && label !== undefined && label !== null && label !== '' && (
            <Text variant="body" color="secondary" style={commonStyles.labelText}>
              {label}
            </Text>
          )}

          {sortedImages.length > 0 && (
            <View style={styles.selectedImagesRow}>
              {sortedImages.slice(0, 10).map((item, index) => (
                <Image
                  key={item.id}
                  source={{ uri: item.image }}
                  style={[
                    styles.selectedImage,
                    index > 0 && styles.selectedImageOverlap,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
        {onPress && (
          <AntDesign name="right" size={16} color="#9CA3AF" />
        )}
      </View>
    </Card>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.pressable,
      pressed && styles.pressed
    ]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    opacity: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  ballotRow: {
    marginBottom: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  selectedImagesRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  selectedImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedImageOverlap: {
    marginLeft: -8,
  },
});

