import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../../ui';
import { ScreenView } from '../../common';
import { TeamList, Team } from '../components';
import { useTranslation } from '../../../i18n';
import { getMockTeams } from '../../../api';
import { useNavigation } from '@react-navigation/native';
import { useSelection, useAuth } from '../../../contexts';

export default function TeamSelectionScreen() {
  const { t } = useTranslation() as any;
  const navigation = useNavigation();
  const { joinedTeamIds } = useSelection();
  const { user } = useAuth();
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  // Get current team ID (first team in joinedTeamIds, or user.team)
  const currentTeamId = joinedTeamIds.find(id => id) || (user?.team?.id ? user.team.id : null);

  // Load initial teams
  useEffect(() => {
    loadTeams(1, true);
  }, []);

  // Load teams function
  const loadTeams = async (pageNum: number, reset: boolean = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = getMockTeams(pageNum, pageSize);
      
      if (reset) {
        setAllTeams(response.data);
      } else {
        setAllTeams(prevTeams => [...prevTeams, ...response.data]);
      }
      
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more teams
  const loadMoreTeams = () => {
    if (hasMore && !isLoading) {
      loadTeams(page + 1, false);
    }
  };

  // Update teams with joined status from context
  useEffect(() => {
    setAllTeams(prevTeams => 
      prevTeams.map(t => ({
        ...t,
        isMember: joinedTeamIds.includes(t.id)
      }))
    );
  }, [joinedTeamIds]);

  const handleTeamPress = (team: Team) => {
    // Navigate to TeamDetailsNewScreen in Stack Navigator
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('TeamDetailsNew', { team });
    } else {
      (navigation as any).navigate('TeamDetailsNew', { team });
    }
  };

  const handleTeamJoin = async (team: Team) => {
    // Navigate to TeamDetailsNewScreen in Stack Navigator when joining a team
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('TeamDetailsNew', { team });
    } else {
      (navigation as any).navigate('TeamDetailsNew', { team });
    }
  };

  const handleCurrentTeamPress = (team: Team) => {
    // Navigate to TeamDetailsScreen for current team in Stack Navigator
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('TeamDetails', { team });
    } else {
      (navigation as any).navigate('TeamDetails', { team });
    }
  };

  const handleCreateTeamPress = () => {
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('CreateTeam');
    } else {
      (navigation as any).navigate('CreateTeam');
    }
  };

  return (
    <ScreenView scrollable={false}>
      <View style={styles.container}>
        <View style={styles.listSection}>
          <TeamList
            allTeams={allTeams}
            currentTeamId={currentTeamId}
            onTeamPress={handleTeamPress}
            onTeamJoin={handleTeamJoin}
            onCurrentTeamPress={handleCurrentTeamPress}
            showCurrentTeam={true}
            currentTeamLabel={t.teams.currentTeam || 'ჩემი გუნდი'}
            otherTeamsLabel={t.teams.selectOtherTeam || 'გუნდების სია'}
            onEndReached={loadMoreTeams}
            hasMore={hasMore}
            isLoading={isLoading}
          />
        </View>
        <View style={styles.footer}>
          <Button
            title={t.teams.createTeam || 'ახალი გუნდის დამატება'}
            onPress={handleCreateTeamPress}
          />
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listSection: {
    flex: 1,
  },
  footer: {
    paddingVertical: 16,
  },
});

