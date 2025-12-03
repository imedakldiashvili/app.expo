import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenView } from '../../common';
import { Text, Spacer, Button } from '../../../ui';
import { useSelection } from '../../../contexts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getActiveElections } from '../../../api';
import { VotingListItem } from '../components';
import { useTranslation } from '../../../i18n';

export default function VotingBallotItemPreviewScreen() {
  const { t } = useTranslation() as any;
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { selectedBallotItem, setSelectedBallotItem, location } = useSelection() as any;

  const electionId = route.params?.electionId;
  const ballotId = route.params?.ballotId;

  const activeElections = getActiveElections();
  const currentElection =
    activeElections.find((election: any) => election.id === electionId) || activeElections[0];
  const currentBallot =
    currentElection?.ballots.find((ballot: any) => ballot.id === ballotId) ||
    currentElection?.ballots[0];

  const listItems = (selectedBallotItem?.listItems ?? []).slice().sort((a: any, b: any) => {
    return (a.position || 0) - (b.position || 0);
  });

  return (
    <ScreenView scrollable={false}>
      <View style={styles.content}>
        <Text variant="h2" align="center" style={styles.title}>
          {currentBallot?.name}
        </Text>
        {currentBallot?.ballotType?.byDistrict && location && (
          <Text variant="body" color="secondary" style={styles.locationText}>
            {location}
          </Text>
        )}
        <Spacer size="md" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {listItems.map((item: any) => (
              <VotingListItem
                key={item.id}
                item={item}
                showBadge={true}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={t.voting?.confirmSelection || 'დაადასტურე არჩევანი'}
          onPress={() => {
            if (!location) {
              (navigation as any).navigate('SelectLocation', {
                returnTo: 'ElectionMain',
                returnParams: { electionId },
              });
              return;
            }
            if (selectedBallotItem) {
              setSelectedBallotItem(selectedBallotItem, true);
            }
            (navigation as any).navigate('ElectionMain', {
              electionId,
            });
          }}
        />
        <Spacer size="sm" />
        <Button
          title={t.voting?.resetSelection || 'თავიდან არჩევა'}
          variant="tertiary"
          onPress={() => {
            if (selectedBallotItem) {
              setSelectedBallotItem({
                ...selectedBallotItem,
                listItems: [],
              });
            }
            navigation.goBack();
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
});


