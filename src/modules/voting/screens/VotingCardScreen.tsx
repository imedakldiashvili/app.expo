import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button } from '../../../ui';
import { ScreenView, PasscodeApproveModal } from '../../common';
import { useTranslation } from '../../../i18n';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getActiveElections } from '../../../api';
import { BallotCard } from '../components';
import { useSelection } from '../../../contexts';
import { usePasscode } from '../../../contexts';

export default function VotingCardScreen() {
  const { t } = useTranslation() as any;
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [currentElection, setCurrentElection] = React.useState<any | null>(null);
  const { selectedBallotItemsByBallotId, setSelectedBallotItemsByBallotId } = useSelection() as any;
  const { validatePasscode } = usePasscode();
  const [showPasscodeModal, setShowPasscodeModal] = React.useState(false);
  const [isValidatingPasscode, setIsValidatingPasscode] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const activeElections = getActiveElections();
      const electionId = (route.params as any)?.electionId;
      const foundElection =
        activeElections.find((election) => election.id === electionId) || activeElections[0];
      setCurrentElection(foundElection);
    }, [route.params])
  );

  const ballots: any[] = currentElection?.ballots ?? [];
  
  // Check if there's at least one ballot with isNewSelection = true
  const hasNewSelections = React.useMemo(() => {
    return Object.values(selectedBallotItemsByBallotId || {}).some(
      (item: any) => item.isNewSelection === true
    );
  }, [selectedBallotItemsByBallotId]);

  // Handle back button with unsaved changes warning
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!hasNewSelections) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        t.voting?.warningTitle || 'გაფრთხილება',
        t.voting?.unsavedChangesMessage || 'შეყვანილი ინფორმაცია დაიკარგება. დარწმუნებული ხართ?',
        [
          {
            text: t.common?.cancel || 'გაუქმება',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: t.common?.leave || 'დატოვება',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasNewSelections, t]);

  const handleSave = () => {
    setShowPasscodeModal(true);
  };

  const handlePasscodeComplete = async (passcode: (string | number)[]) => {
    setIsValidatingPasscode(true);
    try {
      const passcodeString = passcode.join('');
      const isValid = await validatePasscode(passcodeString);
      
      setIsValidatingPasscode(false);
      
      if (isValid) {
        // Update all items with isNewSelection=true to isNewSelection=false
        setSelectedBallotItemsByBallotId((prev: any) => {
          const updated: Record<number, any> = {};
          Object.entries(prev || {}).forEach(([ballotId, item]: [string, any]) => {
            if (item.isNewSelection === true) {
              updated[parseInt(ballotId)] = {
                ...item,
                isNewSelection: false,
              };
            } else {
              updated[parseInt(ballotId)] = item;
            }
          });
          return updated;
        });
        
        setShowPasscodeModal(false);
        
        // Navigate to HomeScreen
        (navigation as any).navigate('Home');
      } else {
        Alert.alert(
          t.auth?.passcodeError || 'შეცდომა',
          t.auth?.passcodeIncorrect || 'არასწორი პასკოდი'
        );
      }
    } catch (error) {
      setIsValidatingPasscode(false);
      Alert.alert(
        t.common?.error || 'შეცდომა',
        t.voting?.saveError || 'შენახვა ვერ მოხერხდა'
      );
    }
  };

  return (
    <ScreenView scrollable={false}>
      {currentElection && (
        <Text variant="h2" align="center" style={{ marginBottom: 16 }}>
          {currentElection.name}
        </Text>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {ballots.map((ballot) => {
          const ballotSelection = selectedBallotItemsByBallotId?.[ballot.id];
          const label = ballotSelection ? ballotSelection.name : ballot.description;

          const selectedImages =
            ballotSelection && ballotSelection.listItems
              ? ballotSelection.listItems
              : [];

          return (
            <BallotCard
              key={ballot.id}
              ballot={ballot}
              label={label}
              selectedImages={selectedImages}
              onPress={() =>
                (navigation as any).navigate('VotingBallot', {
                  electionId: currentElection?.id,
                  ballotId: ballot.id,
                })
              }
            />
          );
        })}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          title={t.voting?.save || t.auth?.save || 'შენახვა'}
          onPress={handleSave}
          variant="primary"
          size="large"
          style={styles.saveButton}
          disabled={!hasNewSelections}
        />
      </View>

      <PasscodeApproveModal
        visible={showPasscodeModal}
        onRequestClose={() => setShowPasscodeModal(false)}
        onPasscodeComplete={handlePasscodeComplete}
        disabled={isValidatingPasscode}
        title={t.voting?.confirmChanges || 'დაადასტურე ცვლილება'}
      />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  saveButton: {
    width: '100%',
  },
});



