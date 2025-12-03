import React from 'react';
import { View, StyleSheet } from 'react-native';
import ActionIconButton from './ActionIconButton';
import { colors } from '../../../constants';
import { MockUser } from '../../../api/mockData';
import { useTranslation } from '../../../i18n';

interface Team {
  id: number;
  name: string;
  logo?: string;
}

interface QuickActionsProps {
  delegates: MockUser[];
  currentTeam: Team | null;
  location: string | null;
  userVerified?: boolean;
  isDelegate?: boolean;
  onDelegatesPress: () => void;
  onDelegatePress?: () => void;
  onTeamPress: () => void;
  onLocationPress: () => void;
}

export default function QuickActions({
  delegates,
  currentTeam,
  location,
  userVerified,
  isDelegate = false,
  onDelegatesPress,
  onDelegatePress,
  onTeamPress,
  onLocationPress,
}: QuickActionsProps) {
  const { t } = useTranslation();
  
  // Delegate icon color: blue if isDelegate=true, gray if false
  const delegateIconColor = isDelegate ? colors.primary : '#9CA3AF';
  
  return (
    <View style={styles.quickActionsRow}>
      {/* Location Card */}
      {location && (
        <ActionIconButton
          icon="environment"
          iconColor={colors.primary}
          name={t.myPoliticians.location}
          onPress={onLocationPress}
        />
      )}

      {/* Referrals Card */}
      <ActionIconButton
        icon="notification"
        iconColor={colors.primary}
        name={t.delegates?.invitation || 'მოწვევა'}
        onPress={onDelegatesPress}
      />

      {/* Team Card */}
      {currentTeam && userVerified && (
        <ActionIconButton
          icon="team"
          iconColor={colors.primary}
          name={t.navigation.teams}
          onPress={onTeamPress}
        />
      )}

      {/* Member Card */}
      <ActionIconButton
        icon="star"
        iconColor={delegateIconColor}
        name="წევრი"
        onPress={onDelegatePress || onDelegatesPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

