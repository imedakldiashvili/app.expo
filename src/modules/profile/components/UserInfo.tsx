import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from '../../../ui';
import { colors } from '../../../constants';
import { useTranslation } from '../../../i18n';
import { AntDesign } from '@expo/vector-icons';
import { UserAvatar } from '../../common';

interface Delegate {
  id: string;
  image?: string | null;
}

interface UserInfoProps {
  user: {
    id: string;
    name?: string;
    email: string;
    fullName?: string | null;
    image?: string | null;
    avatarUrl?: string | null;
    isVerified: boolean;
    isDelegate?: boolean;
    isMember?: boolean;
    teamMember: {
      team: {
        id: number;
        name: string;
        logo?: string;
        type: 'party' | 'movement' | 'ngo';
      };
      isDelegate: boolean;
      isApproved: boolean;
      isLeader: boolean;
    };
    person: {
      personalId: string;
      fullName: string;
    } | null;
  } | null;
  delegates?: Delegate[];
  currentTeam?: { id: number; name: string; logo?: string; type?: 'party' | 'movement' | 'ngo' } | null;
  location?: string | null;
  onDelegatesPress?: () => void;
  onTeamPress?: () => void;
}

export default function UserInfo({ 
  user, 
  delegates = [], 
  currentTeam: currentTeamProp,
  location,
  onDelegatesPress, 
  onTeamPress 
}: UserInfoProps) {
  const { t } = useTranslation();

  const displayFullName = user?.person?.fullName || user?.email || '';
  const displayPersonalId = user?.person?.personalId;
  const avatarLetter = displayFullName?.charAt(0).toUpperCase() || 'U';
  const avatarImage = user?.image || user?.avatarUrl || null;
  const isDelegate = user ? user.teamMember.isDelegate : false;
  const isApproved = user ? user.teamMember.isApproved : false;
  const isLeader = user ? user.teamMember.isLeader : false;
  
  // Team ინფო აიღოს teamMember.team-იდან, თუ currentTeam prop-ად არ გადაეცემა
  const currentTeam = currentTeamProp || (user ? user.teamMember.team : null);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text variant="h2" style={styles.fullName}>
              {displayFullName}
            </Text>
            {displayPersonalId && (
              <Text variant="body" color="secondary" style={styles.personalIdPreview}>
                {displayPersonalId}
              </Text>
            )}
            {location && (
              <Text variant="body" color="secondary" style={styles.locationText}>
                {location}
              </Text>
            )}
          </View>
          <View style={styles.avatarWrapper}>
            <UserAvatar
              image={avatarImage}
              name={displayFullName}
              size={80}
              isDelegate={isDelegate}
              isApproved={isApproved}
              isLeader={isLeader}
              showBadges={true}
            />
          </View>
        </View>

        {/* Team Info */}
        {currentTeam && (
          <View style={styles.teamInfoContainer}>
            <View style={[styles.teamInfoText, !currentTeam.logo && styles.teamInfoTextNoLogo]}>
              <Text variant="body" style={styles.teamName}>
                {currentTeam.name}
              </Text>
              {currentTeam.type && (
                <Text variant="body" color="secondary" style={styles.teamType}>
                  {currentTeam.type === 'party' 
                    ? t.teams?.typeParty || 'პარტია'
                    : currentTeam.type === 'movement' 
                    ? t.teams?.typeMovement || 'მოძრაობა'
                    : t.teams?.typeNgo || 'არასამთავრობო'}
                </Text>
              )}
            </View>
            {currentTeam.logo && (
              <Image
                source={{ uri: currentTeam.logo }}
                style={styles.teamLogo}
                resizeMode="cover"
              />
            )}
          </View>
        )}

        {/* Bottom Divider */}
        <View style={styles.bottomDivider} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 0,
    width: '100%',
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 12,
    paddingBottom: 0,
    minHeight: 80,
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    position: 'relative',
    marginLeft: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.avatarBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.avatarText,
    fontSize: 36,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  fullName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.2,
  },
  personalIdPreview: {
    fontSize: 14,
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    marginTop: 4,
  },
  teamInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginLeft: 0,
    paddingLeft: 0,
    // Avatar is 80px wide (center at 40px), Team logo is 36px wide (center at 18px)
    // To align centers: offset needed is 40 - 18 = 22px from the right edge
    // Since we're using flex-end, we add paddingRight to shift logo left
    paddingRight: 22,
  },
  bottomDivider: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  teamLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    marginRight: 0,
  },
  teamInfoText: {
    flex: 1,
    marginRight: 8,
  },
  teamInfoTextNoLogo: {
    marginRight: 0,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  teamType: {
    fontSize: 12,
    marginTop: 2,
  },
  delegateBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  memberBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  teamDelegatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  delegatesRow: {
    marginTop: 0,
  },
  delegatesImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  delegateImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.cardBackground,
    backgroundColor: colors.avatarBackground,
  },
  delegateImageOverlap: {
    marginLeft: -6,
  },
  moreBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  moreBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});
