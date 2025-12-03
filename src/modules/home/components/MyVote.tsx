import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getActiveElections } from '../../../api';
import { BallotRow, ElectionTitle } from '../../voting/components';
import { Card, ActionButton, Text } from '../../../ui';
import { useSelection, useAuth } from '../../../contexts';

export default function MyVote() {
  const navigation = useNavigation();
  const { selectedBallotItemsByBallotId } = useSelection() as any;
  const { location } = useSelection() as any;
  const { user } = useAuth();
  const activeElections = getActiveElections();
  
  // Get the first active election (or you can make it configurable)
  const currentElection = activeElections[0];
  const ballots = currentElection?.ballots ?? [];

  if (!currentElection) {
    return null;
  }

  return (
    <>
      <ActionButton
        id={currentElection.id}
        leftContent={
          <Text style={styles.voteIcon}>
            👉
          </Text>
        }
        label={currentElection.description}
        title={currentElection.name}
        onPress={(id) => {
          if (!location) {
            (navigation as any).navigate("SelectLocation", {
              returnTo: "ElectionMain",
              returnParams: { electionId: id },
            });
            return;
          }
          (navigation as any).navigate("ElectionMain", { electionId: id });
        }}
        style={styles.actionButton}
        disabled={!user?.isVerified}
      />

    </>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    marginBottom: 4,
  },
  container: {
    marginBottom: 16,
  },
  voteIcon: {
    fontSize: 20,
  },
});

