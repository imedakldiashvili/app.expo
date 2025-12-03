import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert, Pressable } from "react-native";
import { ActionButton, ActionSwitcherButton, Spacer, Text, Card, Divider } from "../../../ui";
import { useTranslation } from "../../../i18n";
import { ScreenView } from "../../common";
import { useAuth, useSelection } from "../../../contexts";
import { UserInfo } from "../../profile";
import QuickActions from "../components/QuickActions";
import { RecentActions } from "../../actions/components";
import { colors } from "../../../constants";
import { getDelegates, getMockTeams, getActiveElections } from "../../../api";
import { MockUser, mockUsers } from "../../../api/mockData";
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from "../../common";
import { Button } from "../../../ui";
import { AntDesign } from '@expo/vector-icons';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();
  const { joinedTeamIds, location } = useSelection();
  const [delegates, setDelegates] = useState<MockUser[]>([]);
  const [isDelegateMode, setIsDelegateMode] = useState(false);
  const [isDelegate, setIsDelegate] = useState(() => {
    return user ? user.teamMember.isDelegate === true : false;
  });
  const activeElections = getActiveElections();
  const currentElection = activeElections[0];

  // Get delegates
  useEffect(() => {
    if (user?.id) {
      const filteredDelegates = getDelegates(user.id);
      setDelegates(filteredDelegates);
      
      // Update isDelegate from user
      if (user.teamMember.isDelegate === true) {
        setIsDelegate(true);
      }
    }
  }, [user?.id]);

  // Get current team from user.teamMember.team
  const currentTeam = useMemo(() => {
    return user ? user.teamMember.team : null;
  }, [user]);

  const handleDelegatesPress = () => {
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('InvitationAdd');
    } else {
      (navigation as any).navigate('InvitationAdd');
    }
  };

  const handleDelegatePress = () => {
    if (!currentTeam || !user) return;
    
    // Create a mock member object from current user
    const member = {
      id: parseInt(user.id) || 1,
      name: user.name || user.email || 'მომხმარებელი',
      photo: user.image || undefined,
      role: 'member' as const,
      status: 'approved' as const,
    };
    
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('TeamMemberDetail', { member, team: currentTeam });
    } else {
      (navigation as any).navigate('TeamMemberDetail', { member, team: currentTeam });
    }
  };

  const handleTeamPress = () => {
    if (!user?.isVerified || !currentTeam) return;
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('TeamDetails', { team: currentTeam });
    } else {
      (navigation as any).navigate('TeamDetails', { team: currentTeam });
    }
  };

  const handleLocationPress = () => {
    (navigation as any).navigate('SelectLocation');
  };

  const handleElectionPress = (id: string | number) => {
    const electionId = String(id);
    if (!location) {
      (navigation as any).navigate("SelectLocation", {
        returnTo: "ElectionMain",
        returnParams: { electionId },
      });
      return;
    }
    (navigation as any).navigate("ElectionMain", { electionId });
  };

  const handleDelegateToggle = (value: boolean) => {
    setIsDelegate(value);
    // TODO: Call API to update delegate status
  };

  return (
    <ScreenView scrollable={true}>
      <View style={styles.container}>
        {/* Hero Section with User Info */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <UserInfo 
              user={user ? {
                id: user.id,
                name: user.name,
                email: user.email,
                fullName: user.fullName,
                image: user.image,
                isVerified: user.isVerified,
                isMember: user.teamMember.team.isMember || false,
                teamMember: user.teamMember,
                person: user.person,
              } : null}
              delegates={delegates}
              currentTeam={currentTeam}
              location={location}
              onDelegatesPress={handleDelegatesPress}
              onTeamPress={handleTeamPress}
            />
          </View>
        </View>

        <Divider style={styles.sectionDivider} />

        {/* Main Content - Vertical Layout */}
        <Divider style={styles.sectionDivider} />
        <View style={styles.mainContent}>

          {/* Quick Actions - Outside Section */}
          {user?.isVerified && (
            <View style={styles.quickActionsWrapper}>
              <QuickActions
                delegates={delegates}
                currentTeam={currentTeam || null}
                location={location}
                userVerified={user?.isVerified}
                isDelegate={user ? user.teamMember.isDelegate : false}
                onDelegatesPress={handleDelegatesPress}
                onDelegatePress={handleDelegatePress}
                onTeamPress={handleTeamPress}
                onLocationPress={handleLocationPress}
              />
            </View>
          )}

          {/* Verification Banner - Below Elections */}
          {user?.isVerified === false && (
            <View style={styles.verificationBanner}>
              <View style={styles.verificationButtonContainer}>
                <ActionButton
                  id="verification"
                  iconName="user"
                  label="გთხოვთ გაიაროთ ვერიფიკაცია"
                  title={user?.email || "ელ-ფოსტა"}
                  onPress={() => {
                    const parent = navigation.getParent();
                    if (parent) {
                      (parent as any).navigate('Verification');
                    } else {
                      (navigation as any).navigate('Verification');
                    }
                  }}
                />
              </View>
            </View>
          )}

          {/* Elections Section */}
          {activeElections.length > 0 && (
            <>
              <View style={styles.electionsContainer}>
                <Card style={styles.electionsCard}>
              <View style={styles.electionsHeader}>
                <Text variant="h3" style={StyleSheet.flatten([styles.electionsTitle, !user?.isVerified && styles.disabledText])}>
                  არჩევნები
                </Text>
              </View>
              <Spacer size="md" />
              <View style={styles.electionsDivider} />
              <View style={styles.electionsList}>
                {activeElections.map((election, index) => {
                  const isLast = index === activeElections.length - 1;
                  return (
                    <View key={election.id}>
                      <Pressable
                        onPress={() => !user?.isVerified || handleElectionPress(election.id)}
                        disabled={!user?.isVerified}
                        style={({ pressed }) => [
                          styles.electionRow,
                          pressed && !user?.isVerified && styles.pressed
                        ]}
                      >
                        <View style={styles.electionLeftIcon}>
                  <Text style={styles.voteIcon}>
                    👉
                  </Text>
                        </View>
                        <View style={styles.electionInfo}>
                          <Text variant="body" style={StyleSheet.flatten([styles.electionName, !user?.isVerified && styles.disabledText])}>
                            {election.name}
                          </Text>
                          <Text variant="body" color="secondary" style={StyleSheet.flatten([styles.electionLabel, !user?.isVerified && styles.disabledText])}>
                            გააკეთე არჩევანი
                          </Text>
                        </View>
                        <AntDesign name="right" size={16} color={!user?.isVerified ? '#D1D5DB' : '#9CA3AF'} />
                      </Pressable>
                      {!isLast && <View style={styles.electionRowDivider} />}
                    </View>
                  );
                })}
              </View>
            </Card>
            </View>
            </>
          )}


        {/* Recent Actions */}
        <Spacer size="md" />
            <RecentActions />
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  heroSection: {
    backgroundColor: colors.cardBackground,
    paddingBottom: 20,
    marginTop: -15,
    marginBottom: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroContent: {
    paddingTop: 0,
    paddingHorizontal: 4,
  },
  verificationBanner: {
    marginTop: 16,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  verificationButtonContainer: {
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  verificationCard: {
    backgroundColor: colors.warning + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderRadius: 8,
  },
  verificationContent: {
    padding: 4,
  },
  verificationText: {
    color: colors.warning,
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 13,
  },
  sectionDivider: {
    marginVertical: 0,
    backgroundColor: colors.borderLight,
  },
  mainContent: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  sectionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionHeaderLine: {
    width: 3,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  recentActionsWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  voteIcon: {
    fontSize: 20,
  },
  becomeDelegateWrapper: {
    marginTop: 5,
    marginBottom: 5,
  },
  votingSectionWrapper: {
    marginTop: 0,
    marginBottom: 20,
  },
  electionCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  electionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  electionHeaderLine: {
    width: 3,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  electionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  electionDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 0,
  },
  voteActionButton: {
    marginBottom: 4,
  },
  voteButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteLeftIcon: {
    marginRight: 12,
  },
  voteInfo: {
    flex: 1,
  },
  voteTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  voteLabel: {
    fontSize: 14,
  },
  electionsContainer: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  electionsCard: {
    marginBottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  electionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
  electionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
  },
  electionsDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 0,
  },
  electionsList: {
    paddingTop: 0,
  },
  electionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  electionLeftIcon: {
    marginRight: 12,
  },
  electionInfo: {
    flex: 1,
  },
  electionName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  electionLabel: {
    fontSize: 14,
  },
  electionRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginLeft: 44,
  },
  pressed: {
    opacity: 0.95,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  disabledImage: {
    opacity: 0.5,
  },
  teamLogoSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  quickActionsWrapper: {
    marginVertical: 16,
  },
  actionsContainer: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  referralsCard: {
    marginBottom: 0,
    paddingVertical: 12,
  },
  delegateToggleContainer: {
    paddingHorizontal: 0,
  },
  delegateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  delegateInfo: {
    flex: 1,
  },
  delegateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
  },
  starContainer: {
    marginLeft: 8,
    padding: 4,
  },
  delegateDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
    marginHorizontal: 0,
  },
  referralsLabel: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 15,
  },
  referralsImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  referralImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  referralImageOverlap: {
    marginLeft: -8,
  },
  inviteSupporterText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
