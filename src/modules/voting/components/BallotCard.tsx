import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, Card } from '../../../ui';
import { commonStyles } from '../../common';

interface BallotCardProps {
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
  onPress: () => void;
}

export default function BallotCard({
  ballot,
  label,
  selectedImages = [],
  onPress,
}: BallotCardProps) {
  const sortedImages = [...selectedImages].sort(
    (a, b) => (a.position || 0) - (b.position || 0)
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Card style={styles.ballotCard}>
        <Text variant="h3" style={commonStyles.nameText}>{ballot.name}</Text>

        {!!label && (
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
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ballotCard: {
    marginBottom: 12,
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
    marginLeft: -12,
  },
});

