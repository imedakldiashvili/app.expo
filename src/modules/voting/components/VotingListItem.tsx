import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Spacer } from '../../../ui';
import { commonStyles } from '../../common';

interface VotingListItemProps {
  item: {
    id: string | number;
    name: string;
    title?: string;
    number?: string | number;
    image?: string;
    position?: number | null;
  };
  onPress?: () => void;
  disabled?: boolean;
  showBadge?: boolean;
  showIcon?: React.ReactNode;
  selectedImages?: Array<{
    id: string | number;
    image: string;
    position?: number;
  }>;
}

export default function VotingListItem({
  item,
  onPress,
  disabled = false,
  showBadge = true,
  showIcon,
  selectedImages = [],
}: VotingListItemProps) {
  const displayNumber = item.number;
  const label = item.title ? `${item.title} ${displayNumber ? `#${displayNumber}` : ''}` : undefined;

  const sortedImages = [...selectedImages]
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .slice(0, 10);

  const content = (
    <Card style={[styles.itemCard, ...(disabled ? [styles.itemCardDisabled] : [])]}>
      <View style={styles.itemRow}>
        <View style={styles.leftContent}>
          {item.image && (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              {showBadge && item.position != null && (
                <View style={styles.badge}>
                  <Text variant="body" style={styles.badgeText}>
                    {item.position}
                  </Text>
                </View>
              )}
            </View>
          )}
          <View style={styles.itemTextContainer}>
            <Text variant="h3" style={commonStyles.nameText}>
              {item.name}
            </Text>
            {label && (
              <>
                <Spacer size="xs" />
                <Text variant="body" color="secondary" style={commonStyles.labelText}>
                  {label}
                </Text>
              </>
            )}
            {sortedImages.length > 0 && (
              <View style={styles.selectedImagesRow}>
                {sortedImages.map((img, index) => (
                  <Image
                    key={img.id}
                    source={{ uri: img.image }}
                    style={[
                      styles.selectedImage,
                      index > 0 && styles.selectedImageOverlap,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
        {showIcon && <View style={styles.iconContainer}>{showIcon}</View>}
      </View>
    </Card>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  itemCard: {
    marginBottom: 12,
  },
  itemCardDisabled: {
    opacity: 0.4,
    backgroundColor: 'transparent',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  itemTextContainer: {
    flex: 1,
  },
  iconContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 10,
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

