import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getActiveElections } from '../../../api';
import { Card, Text, Spacer } from '../../../ui';
import { useSelection } from '../../../contexts';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../../../constants';

interface ElectionSupportersProps {
  electionId: number;
}

export default function ElectionSupporters({ electionId }: ElectionSupportersProps) {
  const navigation = useNavigation();
  const activeElections = getActiveElections();
  const { selectedBallotItemsByBallotId, location } = useSelection() as any;

  const election = activeElections.find((e) => e.id === electionId);
  const ballots = election?.ballots ?? [];

  if (!election || ballots.length === 0) {
    return null;
  }

  const handleBallotPress = (ballotId: number) => {
    if (!location) {
      (navigation as any).navigate('SelectLocation', {
        returnTo: 'VotingBallot',
        returnParams: { electionId, ballotId },
      });
      return;
    }
    (navigation as any).navigate('VotingBallot', { electionId, ballotId });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.wrapperCard}>
        <View style={styles.header}>
          <Text variant="h3" style={styles.title}>
            {election.name}
          </Text>
        </View>
        <Spacer size="sm" />
        <View style={styles.topDivider} />
        <View style={styles.list}>
          {ballots.map((ballot, index) => {
            const selectedBallotItem = selectedBallotItemsByBallotId?.[ballot.id];
            const sortedImages = selectedBallotItem?.listItems?.flatMap((item: any) =>
              item.listItems?.map((listItem: any) => ({
                id: listItem.id,
                image: listItem.image,
                position: listItem.position || listItem.number,
              })) || []
            ) || [];
            const sortedImagesArray = [...sortedImages].sort(
              (a, b) => (a.position || 0) - (b.position || 0)
            );
            const isLast = index === ballots.length - 1;

            return (
              <View key={ballot.id}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleBallotPress(ballot.id)}
                >
                  <View style={styles.rowContainer}>
                    <View style={styles.content}>
                      <View style={styles.headerRow}>
                        <Text variant="body" style={styles.ballotName}>
                          {ballot.name}
                        </Text>
                        <AntDesign name="right" size={16} color="#9CA3AF" />
                      </View>
                      {sortedImagesArray.length > 0 ? (
                        <View style={styles.selectedImagesRow}>
                          {sortedImagesArray.slice(0, 10).map((item, imgIndex) => (
                            <Image
                              key={item.id}
                              source={{ uri: item.image }}
                              style={[
                                styles.selectedImage,
                                imgIndex > 0 && styles.selectedImageOverlap,
                              ]}
                            />
                          ))}
                        </View>
                      ) : (
                        <Text variant="body" color="secondary" style={styles.noDataText}>
                          მონაცემები არ არის
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                {!isLast && <View style={styles.rowDivider} />}
              </View>
            );
          })}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  wrapperCard: {
    marginBottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
  },
  topDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 0,
  },
  list: {
    paddingTop: 8,
    paddingHorizontal: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderRadius: 8,
    marginVertical: 0,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginHorizontal: 0,
    marginTop: 4,
    marginBottom: 4,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ballotName: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  selectedImagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
});

