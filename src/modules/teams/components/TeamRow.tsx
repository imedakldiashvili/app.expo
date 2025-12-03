import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Card, Text } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { AntDesign } from '@expo/vector-icons';
import { Team } from '../interfaces';
import { colors } from '../../../constants';

interface TeamRowProps {
  team: Team;
  onPress?: () => void;
  isLast?: boolean;
}

export default function TeamRow({ 
  team, 
  onPress,
  isLast = false,
}: TeamRowProps) {
  const { t } = useTranslation();

  const content = (
    <Card style={[styles.teamRow, ...(isLast ? [styles.teamRowLast] : [])]} shadow={false}>
      <View style={styles.row}>
        <View style={styles.content}>
          {team.logo && (
            <View style={styles.logoContainer}>
              <Image source={{ uri: team.logo }} style={styles.logo} />
            </View>
          )}
          <View style={styles.info}>
            <Text variant="caption" style={styles.name}>
              {team.name}
            </Text>
            <Text variant="body" color="secondary" style={styles.type}>
              {team.type === 'party' 
                ? t.teams.typeParty 
                : team.type === 'movement' 
                ? t.teams.typeMovement 
                : t.teams.typeNgo}
              {team.number ? `  #${team.number}` : ''}
            </Text>
            {team.memberCount !== undefined && (
              <Text variant="body" color="secondary" style={styles.memberCount}>
                {team.memberCount} {t.teams.members || 'წევრი'}
              </Text>
            )}
          </View>
        </View>
        {onPress && (
          <AntDesign name="right" size={16} color="#9CA3AF" />
        )}
      </View>
    </Card>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.pressable,
      pressed && styles.pressed
    ]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    opacity: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  teamRow: {
    marginBottom: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginHorizontal: 12,
  },
  teamRowLast: {
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 12,
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: 4,
  },
  type: {
    fontSize: 12,
    marginBottom: 2,
  },
  memberCount: {
    fontSize: 12,
    marginBottom: 0,
  },
});

