import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { ScreenView } from '../../common';
import { Text, Spacer, Button } from '../../../ui';
import { getActiveElections } from '../../../api';
import { useSelection } from '../../../contexts';
import { VotingListItem } from '../components';
import { useTranslation } from '../../../i18n';

export default function VotingBallotScreen() {
  const { t } = useTranslation() as any;
  const navigation = useNavigation();
  const route = useRoute<any>();
  const activeElections = getActiveElections();
  const { setSelectedBallotItem, selectedBallotItemsByBallotId } = useSelection() as any;

  const electionId = route.params?.electionId;
  const ballotId = route.params?.ballotId;
  const currentElection =
    activeElections.find((election) => election.id === electionId) || activeElections[0];
  const currentBallot =
    currentElection?.ballots.find((ballot) => ballot.id === ballotId) ||
    currentElection?.ballots[0];
  const ballotItems = currentBallot?.ballotItems ?? [];
  const ballotSelection = currentBallot ? selectedBallotItemsByBallotId?.[currentBallot.id] : null;

  return (
    <ScreenView scrollable={false}>
      {currentBallot && (
        <>
          <Text variant="h2" align="center" style={styles.subtitle}>
            {currentBallot.name}
          </Text>
          <Spacer size="md" />
        </>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View>
          {ballotItems.map((item) => {
            const icon =
              item.type === 'accept' ? (
                <AntDesign name="check" size={20} color="#16A34A" />
              ) : item.type === 'decline' ? (
                <AntDesign name="close" size={20} color="#DC2626" />
              ) : null;

            return (
              <VotingListItem
                key={item.id}
                item={item}
                onPress={() => {
                  if (!currentBallot) {
                    return;
                  }

                  // accept → open list items screen
                  if (item.type === 'accept') {
                    (navigation as any).navigate('VotingBallotItem', {
                      electionId,
                      ballotId: currentBallot.id,
                      ballotItemId: item.id,
                    });
                    return;
                  }

                  // other types (decline etc.) → save and go back
                  setSelectedBallotItem({
                    id: item.id,
                    ballotId: currentBallot.id,
                    name: item.name,
                    description: item.description,
                  }, true); // Mark as new selection
                  navigation.goBack();
                }}
                showBadge={false}
                showIcon={icon}
                selectedImages={
                  item.type === 'accept' &&
                  ballotSelection &&
                  ballotSelection.listItems &&
                  ballotSelection.listItems.length > 0
                    ? ballotSelection.listItems
                    : []
                }
              />
            );
          })}
        </View>

        <Spacer size="lg" />
        <Button title={t.voting?.back || t.common?.back || 'უკან'} variant="outline" onPress={() => navigation.goBack()} />
        <Spacer size="lg" />
      </ScrollView>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});


