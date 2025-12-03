import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Spacer, Card } from '../../../ui';
import { colors } from '../../../constants';
import { AntDesign } from '@expo/vector-icons';
import { MockUser } from '../../../api/mockData';

interface MySupportersProps {
  supporters: MockUser[];
  currentTeam: any;
  navigation: any;
  userVerified?: boolean;
}

export default function MySupporters({ supporters, currentTeam, navigation, userVerified = true }: MySupportersProps) {
  return (
    <>
      <Spacer size="md" />
      <Card style={styles.supportersCard}>
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <View style={styles.supportersHeader}>
                <Text variant="h3" style={[styles.supportersTitle, !userVerified && styles.disabledText]}>
                  ჩემი რეფერალები
                </Text>
            </View>
            {supporters.length > 0 ? (
              <View style={styles.supportersImagesContainer}>
                {supporters
                  .slice(0, 10)
                  .map((supporter, index) => (
                    <Image
                      key={supporter.id}
                      source={{ uri: supporter.image || 'https://i.pravatar.cc/150?img=' + (index + 1) }}
                      style={[
                        styles.supporterImage,
                        index > 0 && styles.supporterImageOverlap,
                        !userVerified && styles.disabledImage,
                      ]}
                    />
                  ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text variant="body" color="secondary" style={[styles.emptyStateText, !userVerified && styles.disabledText]}>
                  მოიწვიე მხარდამჭერები
                </Text>
              </View>
            )}
          </View>
          <View style={styles.iconContainer}>
            <AntDesign name="right" size={16} color={!userVerified ? '#D1D5DB' : '#9CA3AF'} />
          </View>
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  supportersCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'column',
  },
  supportersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    alignSelf: 'stretch',
  },
  supportersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
  },
  supportersImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 8,
  },
  supporterImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  supporterImageOverlap: {
    marginLeft: -8,
  },
  emptyStateContainer: {
    paddingTop: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  disabledImage: {
    opacity: 0.5,
  },
});

