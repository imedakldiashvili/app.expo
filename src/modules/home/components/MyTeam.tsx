import React, { useMemo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, Card } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { useAuth, useSelection } from '../../../contexts';
import { getMockTeams } from '../../../api';
import { commonStyles } from '../../common';
import { colors } from '../../../constants';

export default function MyTeam() {
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
    return user?.team || null;
  }, [joinedTeamIds, user?.team]);

  const handleTeamPress = () => {
    if (!user?.isVerified) return;
    // Navigate to TeamSelection in Stack Navigator
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('TeamSelection');
    } else {
      (navigation as any).navigate('TeamSelection');
    }
  };

  if (!currentTeam || !user?.isVerified) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLine} />
        <Text variant="h3" style={styles.headerTitle}>
          {t.teams?.currentTeam || 'ჩემი გუნდი'}
        </Text>
      </View>
      <TouchableOpacity onPress={handleTeamPress} activeOpacity={0.7} style={styles.iconOnlyWrapper}>
        <View style={styles.iconOnlyContainer}>
          <AntDesign name="team" size={32} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLine: {
    width: 3,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  iconOnlyWrapper: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOnlyContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


