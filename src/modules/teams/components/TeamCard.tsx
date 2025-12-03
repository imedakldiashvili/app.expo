import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { Team } from '../interfaces';

export type { Team };

interface TeamCardProps {
  team: Team;
  onPress?: () => void;
  onJoin?: (team: Team) => void;
}

export default function TeamCard({ 
  team, 
  onPress,
  onJoin,
}: TeamCardProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.content}>
          {team.logo && (
            <View style={styles.logoContainer}>
              <Image source={{ uri: team.logo }} style={styles.logo} />
            </View>
          )}
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text variant="body" style={styles.name}>
                {team.name}
              </Text>
            </View>
            <Text variant="body" color="secondary" style={styles.type}>
              {team.type === 'party' 
                ? t.teams.typeParty 
                : team.type === 'movement' 
                ? t.teams.typeMovement 
                : t.teams.typeNgo}
              {team.number ? `  #${team.number}` : ''}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginRight: 12,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
  },
  type: {
    marginBottom: 0,
  },
});

