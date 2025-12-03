import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ActionButton } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { useNavigation } from '@react-navigation/native';
import { useAuth, useSelection } from '../../../contexts';
import { getMockTeams } from '../../../api';
import { Team } from '../../teams';

interface TeamsButtonProps {
  disabled?: boolean;
}

export default function TeamsButton({ disabled = false }: TeamsButtonProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { joinedTeamIds } = useSelection();

  // Get current team from joinedTeamIds (first team is the selected one)
  const currentTeam = useMemo(() => {
    if (joinedTeamIds.length > 0) {
      const teamsResponse = getMockTeams(1, 100); // Get all teams for search
      return teamsResponse.data.find(t => t.id === joinedTeamIds[0]);
    }
    return null;
  }, [joinedTeamIds]);

  const handlePress = () => {
    if (disabled) return;
    // Navigate to TeamSelection in Stack Navigator
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('TeamSelection');
    } else {
      (navigation as any).navigate('TeamSelection');
    }
  };

  return (
    <ActionButton
      id="teams"
      iconName="team"
      label={t.navigation.teams}
      title={currentTeam?.name || user?.team?.name || t.teams.teamName}
      onPress={handlePress}
      style={styles.card}
      disabled={disabled}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
});

