import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, Alert, TouchableOpacity, FlatList } from 'react-native';
import { Text, Spacer, Button, Card } from '../../../ui';
import { ScreenView, PasscodeApproveModal, UserAvatar } from '../../common';
import { Team, MyMemberInfo } from '../components';
import { useTranslation } from '../../../i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelection, useAuth, usePasscode } from '../../../contexts';
import { colors } from '../../../constants';
import { AntDesign } from '@expo/vector-icons';
import { getMockTeams } from '../../../api';
import { mockUsers } from '../../../api/mockData';

// Mock member data - in real app this would come from API
type MemberRole = 'admin' | 'approver' | 'member';
type MemberStatus = 'pending' | 'approved';

interface Member {
  id: number;
  name: string;
  photo?: string;
  role: MemberRole;
  status: MemberStatus;
  isLeader?: boolean;
  location?: string;
  isDelegate?: boolean;
  isApproved?: boolean;
}

const getMockMembers = (teamId: number): Member[] => {
  // Filter users who have this team
  const teamUsers = mockUsers.filter(u => u.teamMember.team.id === teamId);
  
  return teamUsers.map((user, i) => {
    const isApproved = user.teamMember.isApproved || false;
    return {
      id: parseInt(user.id) || i + 1,
      name: user.person?.fullName || user.userName || user.email || `წევრი ${i + 1}`,
      photo: user.image || undefined,
      role: i === 0 ? 'admin' : i === 1 ? 'approver' : 'member',
      status: isApproved ? 'approved' : 'pending', // Sync status with isApproved
      isLeader: user.teamMember.isLeader || false,
      location: user.location?.name || undefined,
      isDelegate: user.teamMember.isDelegate || false,
      isApproved: isApproved,
    };
  });
};

export default function TeamDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { joinedTeamIds, setJoinedTeamIds, removeJoinedTeam } = useSelection();
  const { updateUserTeam, user } = useAuth();
  const { validatePasscode } = usePasscode();
  const routeTeam = (route.params as any)?.team as Team | undefined;
  
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [isValidatingPasscode, setIsValidatingPasscode] = useState(false);
  const [passcodeAction, setPasscodeAction] = useState<'join' | 'leave' | null>(null);
  
  // State for the current team (either from route params or loaded automatically)
  const [team, setTeam] = useState<Team | undefined>(routeTeam);
  // Track if this is the current/active team (loaded automatically without route params)
  const [isCurrentTeam, setIsCurrentTeam] = useState<boolean>(!routeTeam);

  const [isMember, setIsMember] = useState(team?.isMember || joinedTeamIds.includes(team?.id || 0));
  const [memberCount, setMemberCount] = useState(team?.memberCount || 0);
  const [members, setMembers] = useState<Member[]>(() => getMockMembers(team?.id || 0));
  
  // Load current team if not provided in route params
  useEffect(() => {
    if (!routeTeam) {
      setIsCurrentTeam(true);
      // Try to get current team from joinedTeamIds (first team that's not id: 1)
      const currentTeamId = joinedTeamIds.find(id => id !== 1);
      if (currentTeamId) {
        const teamsResponse = getMockTeams(1, 100); // Get all teams for search
        const foundTeam = teamsResponse.data.find(t => t.id === currentTeamId);
        if (foundTeam) {
          setTeam(foundTeam);
          return;
        }
      }
      
      // Fallback to user's team
      if (user && user.teamMember.team.id !== 1) {
        setTeam(user.teamMember.team);
        return;
      }
    } else {
      setIsCurrentTeam(false);
    }
  }, [routeTeam, joinedTeamIds, user]);
  
  // Update team when route params change
  useEffect(() => {
    if (routeTeam) {
      setTeam(routeTeam);
      setIsCurrentTeam(false);
    }
  }, [routeTeam]);
  
  // Check if team is current team (first team in joinedTeamIds or user's team)
  const isActiveTeam = useMemo(() => {
    if (!team || team.id === 1) return false;
    const currentTeamId = joinedTeamIds.find(id => id !== 1);
    return isCurrentTeam || team.id === currentTeamId || (user && team.id === user.teamMember.team.id);
  }, [team, isCurrentTeam, joinedTeamIds, user]);
  
  // Calculate status counts
  const approvedCount = members.filter(m => m.status === 'approved').length;
  const pendingCount = members.filter(m => m.status === 'pending').length;

  // Initialize selectedStatuses: both statuses selected by default
  const [selectedStatuses, setSelectedStatuses] = useState<Set<MemberStatus>>(() => {
    return new Set<MemberStatus>(['pending', 'approved']);
  });



  // Get current user member if exists
  const currentUserMember = useMemo(() => {
    if (!user) return null;
    const userId = parseInt(user.id);
    const member = members.find(m => {
      // Try both direct comparison and string comparison
      return m.id === userId || m.id.toString() === user.id;
    });
    console.log('currentUserMember debug:', {
      user: user?.id,
      userId,
      membersCount: members.length,
      memberIds: members.map(m => m.id),
      foundMember: member,
      isLeader: member?.isLeader
    });
    return member || null;
  }, [members, user]);

  // Filter members for list (include all members)
  const filteredMembers = useMemo(() => {
    // Sort: leaders first, then by status (pending first, then approved)
    return [...members].sort((a, b) => {
      // Leaders first
      if (a.isLeader && !b.isLeader) return -1;
      if (!a.isLeader && b.isLeader) return 1;
      // Then by status: pending first, then approved
      if (a.status === 'pending' && b.status === 'approved') return -1;
      if (a.status === 'approved' && b.status === 'pending') return 1;
      return 0;
    });
  }, [members]);

  // Update members when team changes
  useEffect(() => {
    if (team) {
      setIsMember(joinedTeamIds.includes(team.id));
      const teamMembers = getMockMembers(team.id);
      setMembers(teamMembers);
      setMemberCount(teamMembers.length);
    }
  }, [team, joinedTeamIds]);

  if (!team) {
    return (
      <ScreenView scrollable={true}>
        <Text variant="h2" align="center">{t.teams.teamNotFound}</Text>
      </ScreenView>
    );
  }

  const handleJoin = () => {
    // Show passcode modal for approval
    if (team) {
      setPasscodeAction('join');
      setShowPasscodeModal(true);
    }
  };

  const handlePasscodeComplete = async (passcode: (string | number)[]) => {
    setIsValidatingPasscode(true);
    try {
      const passcodeString = passcode.join('');
      const isValid = await validatePasscode(passcodeString);
      
      setIsValidatingPasscode(false);
      
      if (isValid && team) {
        // Clear all joined teams and join only this team
        setJoinedTeamIds([team.id]);
        setIsMember(true);
        const newMemberCount = memberCount + 1;
        setMemberCount(newMemberCount);

        // Update team and pass to parent screen via route params
        const updatedTeam: Team = {
          ...team,
          isMember: true,
          memberCount: newMemberCount,
        };

        // Update local team state
        setTeam(updatedTeam);

        // Update user team in AuthContext
        await updateUserTeam({
          team: updatedTeam,
          isDelegate: user ? user.teamMember.isDelegate : false,
          isApproved: user ? user.teamMember.isApproved : true,
          isLeader: user ? user.teamMember.isLeader : false,
        });

        // TODO: Call API to join team with pending status
        setShowPasscodeModal(false);
        setPasscodeAction(null);
        
        // Wait for state updates to complete before navigation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Navigate to Home tab (initial screen) via Stack Navigator
            const parent = navigation.getParent() as any;
            if (parent) {
              parent.navigate('MainTabs', {
                screen: 'Home',
              });
            } else {
              // Fallback: navigate to MainTabs if no parent
              (navigation as any).navigate('MainTabs', {
                screen: 'Home',
              });
            }
          });
        });
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

  const handleLeave = () => {
    // Show passcode modal for approval
    if (team) {
      setPasscodeAction('leave');
      setShowPasscodeModal(true);
    }
  };

  const handleLeavePasscodeComplete = async (passcode: (string | number)[]) => {
    setIsValidatingPasscode(true);
    try {
      const passcodeString = passcode.join('');
      const isValid = await validatePasscode(passcodeString);
      
      setIsValidatingPasscode(false);
      
      if (isValid && team) {
        // Update joined status in context
        removeJoinedTeam(team.id);
        setIsMember(false);
        const newMemberCount = Math.max(0, memberCount - 1);
        setMemberCount(newMemberCount);

        // Get default team (id: 1)
        const { getMockTeams } = await import('../../../api');
        const teamsResponse = getMockTeams(1, 100); // Get all teams for search
        const defaultTeam = teamsResponse.data.find(t => t.id === 1) || {
          id: 1,
          name: 'გუნდის გარეშე',
          number: 0,
          logo: 'https://picsum.photos/seed/nogroup/200/200',
          type: 'ngo' as const,
          isMember: false,
          memberCount: 0,
        };

        // Update user team in AuthContext to default team
        await updateUserTeam({
          team: defaultTeam,
          isDelegate: false,
          isApproved: false,
          isLeader: false,
        });

        // TODO: Call API to leave team
        setShowPasscodeModal(false);
        setPasscodeAction(null);
        
        // Wait for state updates to complete before navigation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Navigate to Home tab (initial screen) via Stack Navigator
            const parent = navigation.getParent() as any;
            if (parent) {
              parent.navigate('MainTabs', {
                screen: 'Home',
              });
            } else {
              // Fallback: navigate to MainTabs if no parent
              (navigation as any).navigate('MainTabs', {
                screen: 'Home',
              });
            }
          });
        });
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
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {team.logo && (
                <Image source={{ uri: team.logo }} style={styles.logo} />
              )}
              <View style={styles.headerInfo}>
                <Text variant="h3" style={styles.name}>
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
              </View>
            </View>
          </View>

          <Spacer size="sm" />

          {/* Members List */}
          <Card style={styles.membersCard}>
            <View style={styles.membersCardHeader}>
              <Text variant="body" style={styles.membersCardTitle}>
                წევრების რაოდენობა: {memberCount}
              </Text>
            </View>
            {filteredMembers.length > 0 && (
              <View style={styles.membersContainer}>
                <View style={styles.memberDivider} />
                <FlatList
                  data={filteredMembers}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <TouchableOpacity
                          style={styles.memberItem}
                          activeOpacity={0.7}
                          onPress={() => {
                            const parent = navigation.getParent();
                            if (parent) {
                              (parent as any).navigate('TeamMemberDetail', { member: item, team });
                            } else {
                              (navigation as any).navigate('TeamMemberDetail', { member: item, team });
                            }
                          }}
                        >
                          <View style={styles.memberContent}>
                            <UserAvatar
                              image={item.photo}
                              name={item.name}
                              size={48}
                              isDelegate={item.isDelegate}
                              isApproved={item.isApproved}
                              isLeader={item.isLeader}
                              showBadges={true}
                            />
                            <View style={styles.memberTextContainer}>
                              <Text variant="body" style={styles.memberName}>
                                {item.name}
                              </Text>
                              {item.location && (
                                <Text variant="body" color="secondary" style={styles.memberLocation}>
                                  {item.location}
                                </Text>
                              )}
                            </View>
                          </View>
                          <View style={styles.actionButton}>
                            <AntDesign name="right" size={16} color="#9CA3AF" />
                          </View>
                        </TouchableOpacity>
                        {index < filteredMembers.length - 1 && (
                          <View style={styles.memberDivider} />
                        )}
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={true}
                  style={styles.membersList}
                />
              </View>
            )}
            {!isMember && (
              <View style={styles.membersCardFooter}>
                <Button
                  title={t.teams.joinTeam || 'ჯგუფში გაწევრიანება'}
                  onPress={handleJoin}
                  variant="primary"
                  style={styles.footerButton}
                />
              </View>
            )}
          </Card>
          
          {currentUserMember && (
            <MyMemberInfo member={currentUserMember} team={team} />
          )}
          
          {isMember && (
            <View style={styles.buttonContainer}>
              <Button
                title={t.teams.changeTeam || 'ჯგუფის ცვლილება'}
                onPress={handleLeave}
                variant="outline"
                style={styles.footerButton}
              />
            </View>
          )}
        </View>
      </View>

      <PasscodeApproveModal
        visible={showPasscodeModal}
        onRequestClose={() => {
          setShowPasscodeModal(false);
          setPasscodeAction(null);
        }}
        onPasscodeComplete={async (passcode) => {
          if (passcodeAction === 'leave') {
            await handleLeavePasscodeComplete(passcode);
          } else {
            await handlePasscodeComplete(passcode);
          }
        }}
        disabled={isValidatingPasscode}
        title={t.voting?.confirmChanges || 'პასკოდით დასტური'}
      />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'column',
    minHeight: 0,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexShrink: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'cover',
  },
  name: {
    marginBottom: 4,
  },
  type: {
    marginBottom: 0,
  },
  infoCardContainer: {
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    flex: 1,
    minHeight: 0,
    gap: 8,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 0,
    paddingHorizontal: 16,
    overflow: 'hidden',
    flex: 1,
    minHeight: 0,
  },
  infoContainer: {
    paddingHorizontal: 0,
    minHeight: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 0,
  },
  infoRowWithButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  memberCountContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  memberCountNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexShrink: 0,
  },
  statusButtonsContainer: {
    flex: 0.2,
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 0,
    marginBottom: 0,
    gap: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  membersCardContainer: {
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 0,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'left',
  },
  membersContainer: {
    paddingHorizontal: 0,
    marginTop: 0,
    paddingTop: 0,
    flex: 1,
    minHeight: 200,
    alignItems: 'flex-start',
  },
  membersList: {
    flex: 1,
    alignSelf: 'stretch',
    minHeight: 200,
  },
  membersListContent: {
    paddingBottom: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    alignSelf: 'stretch',
  },
  statusBar: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 8,
  },
  memberContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  memberPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 12,
  },
  placeholderPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
  },
  memberName: {
    fontWeight: '500',
  },
  memberLocation: {
    fontSize: 13,
    marginTop: 2,
  },
  actionButton: {
    marginLeft: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    alignSelf: 'stretch',
    marginLeft: 0,
  },
  membersCard: {
    marginBottom: 0,
    paddingVertical: 16,
    flex: 1,
    minHeight: 0,
  },
  membersCardHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  membersCardTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  membersCardFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerButton: {
    width: '100%',
  },
  membersContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersLeft: {
    flex: 1,
    flexDirection: 'column',
  },
  membersLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelIconContainerBlue: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  labelIconContainerGreen: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  labelIconContainerOrange: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  membersLabel: {
    fontWeight: '600',
    fontSize: 15,
  },
  membersImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberImageWrapper: {
    position: 'relative',
  },
  memberImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberImageOverlap: {
    marginLeft: -8,
  },
  membersIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  joinButtonsContainer: {
    flexDirection: 'column',
  },
  statusButton: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  statusButtonSelectedGreen: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  statusButtonUnselectedGreen: {
    backgroundColor: 'transparent',
    borderColor: '#16A34A',
  },
  statusButtonSelectedOrange: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  statusButtonUnselectedOrange: {
    backgroundColor: 'transparent',
    borderColor: '#EA580C',
  },
  statusButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  statusButtonTextSelected: {
    color: '#FFFFFF',
  },
  statusButtonTextUnselectedGreen: {
    color: '#16A34A',
  },
  statusButtonTextUnselectedOrange: {
    color: '#EA580C',
  },
  memberStatusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberStatusButton: {
    flexShrink: 1,
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    minWidth: 0,
  },
  memberStatusButtonSelectedOrange: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  memberStatusButtonUnselectedOrange: {
    backgroundColor: 'transparent',
    borderColor: '#EA580C',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderRightWidth: 1,
  },
  memberStatusButtonSelectedGreen: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  memberStatusButtonUnselectedGreen: {
    backgroundColor: 'transparent',
    borderColor: '#16A34A',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderLeftWidth: 1,
  },
  memberStatusButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  memberStatusButtonTextSelected: {
    color: '#FFFFFF',
  },
  memberStatusButtonTextUnselectedGreen: {
    color: '#16A34A',
  },
  memberStatusButtonTextUnselectedOrange: {
    color: '#EA580C',
  },
  myMemberRowContainer: {
    paddingHorizontal: 0,
    marginTop: 24,
    marginBottom: 16,
  },
  myMemberRowCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 0,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  leadersContainer: {
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 16,
  },
  leadersCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 0,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
});

