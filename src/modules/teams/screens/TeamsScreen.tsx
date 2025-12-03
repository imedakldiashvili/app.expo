import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Spacer, Button } from '../../../ui';
import { ScreenView } from '../../common';
import { TeamList, Team } from '../components';
import { useTranslation } from '../../../i18n';
import { getMockTeams } from '../../../api';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { useSelection, useAuth } from '../../../contexts';

export default function TeamsScreen() {
  const { t } = useTranslation() as any;
  const navigation = useNavigation();
  const route = useRoute();
  const { joinedTeamIds, setJoinedTeamIds } = useSelection();
  const { updateUserTeam, user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  // Get current team ID (first team in joinedTeamIds, or user.teamMember.team)
  const currentTeamId = joinedTeamIds.find(id => id) || (user?.teamMember?.team?.id ? user.teamMember.team.id : null);

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
        setTeams(response.data);
      } else {
        setTeams(prevTeams => [...prevTeams, ...response.data]);
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

  // Update teams with joined status from context (only new joins, not from mock data)
  useEffect(() => {
    setTeams(prevTeams => 
      prevTeams.map(t => ({
        ...t,
        isMember: joinedTeamIds.includes(t.id)
      }))
    );
  }, [joinedTeamIds]);

  // Update teams when coming back from TeamDetailsScreen
  useFocusEffect(
    useCallback(() => {
      // Check route params for updated team
      const params = route.params as any;
      if (params?.updatedTeam) {
        const updatedTeam = params.updatedTeam as Team;
        setTeams(prevTeams => {
          const exists = prevTeams.find(t => t.id === updatedTeam.id);
          if (exists) {
            // Update existing team with isMember from context
            return prevTeams.map(t => 
              t.id === updatedTeam.id 
                ? { ...updatedTeam, isMember: joinedTeamIds.includes(updatedTeam.id) }
                : t
            );
          }
          return prevTeams;
        });
        // Note: navigation.setParams might not work on Tab Navigator
        // Params will be cleared on next navigation
      }
    }, [route.params, joinedTeamIds])
  );


  const handleTeamPress = (team: Team) => {
    // Navigate to TeamDetailsScreen in Stack Navigator
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('TeamDetails', { team });
    } else {
      (navigation as any).navigate('TeamDetails', { team });
    }
  };

  const handleTeamJoin = async (team: Team) => {
    // First remove from all teams, then join only this team
    // Clear all joined teams and join only this team
    setJoinedTeamIds([team.id]);
    
    // Update member count
    const updatedTeam = {
      ...team,
      memberCount: (team.memberCount || 0) + 1,
    };
    
    setTeams(prevTeams => 
      prevTeams.map(t => 
        t.id === team.id 
          ? updatedTeam
          : t
      )
    );

    // Update user team in AuthContext
    await updateUserTeam({
      team: updatedTeam,
      isDelegate: user ? user.teamMember.isDelegate : false,
      isApproved: user ? user.teamMember.isApproved : true,
      isLeader: user ? user.teamMember.isLeader : false,
    });

    // TODO: Call API to join team
    Alert.alert(
      t.teams.joinSuccess,
      t.teams.joinedTeamMessage.replace('{name}', team.name),
      [
        { 
          text: t.common.confirm,
          onPress: () => {
            // Navigate to TeamDetailsScreen after joining in Stack Navigator
            const parent = navigation.getParent();
            if (parent) {
              (parent as any).navigate('TeamDetails', { team: updatedTeam });
            } else {
              (navigation as any).navigate('TeamDetails', { team: updatedTeam });
            }
          }
        }
      ]
    );
  };

  const handleCreateTeam = () => {
    (navigation as any).navigate('CreateTeam');
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

  return (
    <ScreenView scrollable={false}>
      <View style={styles.listContainer}>
        <TeamList
          allTeams={teams}
          currentTeamId={currentTeamId}
          onTeamPress={handleTeamPress}
          onTeamJoin={handleTeamJoin}
          onCurrentTeamPress={handleCurrentTeamPress}
          showCurrentTeam={true}
          currentTeamLabel={t.teams.currentTeam || 'ჩემი გუნდი'}
          otherTeamsLabel={t.teams.otherTeams || 'გუნდების სია'}
          onEndReached={loadMoreTeams}
          hasMore={hasMore}
          isLoading={isLoading}
          buttonTitle={t.teams.createTeam || 'ახალი გუნდი'}
          onButtonPress={handleCreateTeam}
        />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});

