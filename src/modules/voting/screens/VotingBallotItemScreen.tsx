import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { ScreenView } from '../../common';
import { Text, Spacer, Button } from '../../../ui';
import { getActiveElections } from '../../../api';
import { useSelection } from '../../../contexts';
import { VotingListItem } from '../components';
import { useTranslation } from '../../../i18n';

export default function VotingBallotItemScreen() {
  const { t } = useTranslation() as any;
  const navigation = useNavigation();
  const route = useRoute<any>();
  const activeElections = getActiveElections();
  const { selectedBallotItem, setSelectedBallotItem, location } = useSelection() as any;

  const electionId = route.params?.electionId;
  const ballotId = route.params?.ballotId;
  const ballotItemId = route.params?.ballotItemId;

  const currentElection =
    activeElections.find((election) => election.id === electionId) || activeElections[0];
  const currentBallot =
    currentElection?.ballots.find((ballot) => ballot.id === ballotId) ||
    currentElection?.ballots[0];
  const currentBallotItem =
    currentBallot?.ballotItems.find((item) => item.id === ballotItemId) ||
    currentBallot?.ballotItems[0];

  // When ballot is byDistrict, filter listItems by user's location
  const rawTeams = currentBallotItem?.listItems ?? [];
  const filteredTeams =
    currentBallot?.ballotType?.byDistrict && location
      ? rawTeams.filter((team: any) => team.location?.name === location)
      : rawTeams;

  const listItems = filteredTeams.flatMap((team: any) => team.listItems ?? []);
  const rawMaxSelections = currentBallotItem?.maxSelectedItem;
  // If rawMaxSelections is undefined or 0, treat as "no limit"
  const maxSelections = rawMaxSelections && rawMaxSelections > 0 ? rawMaxSelections : Infinity;
  const [selectedListItems, setSelectedListItems] = React.useState<any[]>([]);

  // When screen gains focus, sync local selection with global context
  useFocusEffect(
    React.useCallback(() => {
      if (
        selectedBallotItem &&
        selectedBallotItem.ballotId === ballotId &&
        selectedBallotItem.id === ballotItemId
      ) {
        setSelectedListItems(selectedBallotItem.listItems ?? []);
      } else {
        setSelectedListItems([]);
      }
    }, [selectedBallotItem, ballotId, ballotItemId])
  );

  const handleListItemPress = (item: any) => {
    const isSelected = selectedListItems.some((li) => li.id === item.id);

    // If trying to add new item and limit is reached, ignore
    if (!isSelected && maxSelections !== Infinity && selectedListItems.length >= maxSelections) {
      return;
    }

    const updated = isSelected
      ? selectedListItems.filter((li) => li.id !== item.id)
      : [...selectedListItems, item];

    const withPositions = updated.map((li, index) => ({
      ...li,
      position: index + 1,
    }));

    if (currentBallotItem && currentBallot) {
      setSelectedBallotItem({
        id: currentBallotItem.id,
        ballotId: currentBallot.id,
        name: currentBallotItem.name,
        description: currentBallotItem.description,
        listItems: withPositions,
      });
    }

    setSelectedListItems(updated);
  };

  return (
    <ScreenView scrollable={false}>
      <View style={styles.content}>
        {currentBallotItem && (
          <>
            <Text variant="h2" align="center" style={styles.title}>
              {currentBallot?.name}
            </Text>
            {currentBallot?.ballotType?.byDistrict && location && (
              <Text variant="body" color="secondary" style={styles.locationText}>
                {location}
              </Text>
            )}
            {maxSelections !== Infinity && (
              <Text variant="body" color="secondary" style={styles.counterText}>
                {t.voting?.selectedCount || 'არჩეულია'} {selectedListItems.length}/{maxSelections}
              </Text>
            )}
            <Spacer size="md" />
          </>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {listItems.map((item) => {
              const selectedIndex = selectedListItems.findIndex((li) => li.id === item.id);
              const position = selectedIndex >= 0 ? selectedIndex + 1 : null;
              const isSelected = selectedIndex >= 0;
              const isLimitReached =
                !isSelected && maxSelections !== Infinity && selectedListItems.length >= maxSelections;

              return (
                <VotingListItem
                  key={item.id}
                  item={{ ...item, position }}
                  onPress={() => handleListItemPress(item)}
                  disabled={isLimitReached}
                  showBadge={true}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={t.voting?.continue || 'გაგრძელება'}
          disabled={selectedListItems.length === 0}
          onPress={() => {
            if (selectedListItems.length === 0) {
              navigation.goBack();
              return;
            }
            (navigation as any).navigate('VotingBallotItemPreview', {
              electionId,
              ballotId,
              ballotItemId,
            });
          }}
        />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
  locationText: {
    marginTop: 4,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  counterText: {
    marginTop: 4,
    textAlign: 'center',
  },
});


