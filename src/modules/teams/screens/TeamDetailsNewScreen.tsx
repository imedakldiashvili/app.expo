import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Text, Spacer, Button, Card } from '../../../ui';
import { ScreenView, PasscodeApproveModal, UserAvatar } from '../../common';
import { Team } from '../components';
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
  
  return teamUsers.map((user, i) => ({
    id: parseInt(user.id) || i + 1,
    name: user.person?.fullName || user.userName || user.email || `წევრი ${i + 1}`,
    photo: user.image || undefined,
    role: i === 0 ? 'admin' : i === 1 ? 'approver' : 'member',
    status: i < 3 ? 'approved' : 'pending', // First 3 approved, rest pending
    isLeader: user.teamMember.isLeader || false,
    location: user.location?.name || undefined,
    isDelegate: user.teamMember.isDelegate || false,
    isApproved: user.teamMember.isApproved || false,
  }));
};

export default function TeamDetailsNewScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { joinedTeamIds, setJoinedTeamIds, removeJoinedTeam } = useSelection();
  const { updateUserTeam, user } = useAuth();
  const { validatePasscode } = usePasscode();
  const routeTeam = (route.params as any)?.team as Team | undefined;
  
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [isValidatingPasscode, setIsValidatingPasscode] = useState(false);
  
  // State for the new selected team (must be provided in route params)
  const [team, setTeam] = useState<Team | undefined>(routeTeam);

  const [isMember, setIsMember] = useState(team?.isMember || joinedTeamIds.includes(team?.id || 0));
  const [memberCount, setMemberCount] = useState(team?.memberCount || 0);
  const [members, setMembers] = useState<Member[]>(() => getMockMembers(team?.id || 0));
  
  // Update team when route params change
  useEffect(() => {
    if (routeTeam) {
      setTeam(routeTeam);
    }
  }, [routeTeam]);
  
  // Calculate status counts
  const approvedCount = members.filter(m => m.status === 'approved').length;
  const pendingCount = members.filter(m => m.status === 'pending').length;

  // Initialize selectedStatuses: both statuses selected by default
  const [selectedStatuses, setSelectedStatuses] = useState<Set<MemberStatus>>(() => {
    return new Set<MemberStatus>(['pending', 'approved']);
  });


  // Check if this is the user's team
  const isUserTeam = useMemo(() => {
    if (!team || !user) return false;
    return (user && team.id === user.teamMember.team.id) || joinedTeamIds.includes(team.id);
  }, [team, user, joinedTeamIds]);

  // Filter members based on selected statuses
  const filteredMembers = useMemo(() => {
    let filtered = selectedStatuses.size > 0
      ? members.filter(m => selectedStatuses.has(m.status))
      : members;
    
    // Sort: pending first, then approved
    return [...filtered].sort((a, b) => {
      if (a.status === 'pending' && b.status === 'approved') return -1;
      if (a.status === 'approved' && b.status === 'pending') return 1;
      return 0;
    });
  }, [members, selectedStatuses]);

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

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text variant="body" color="secondary">{t.teams.memberCount}</Text>
              <Text variant="h3">{memberCount}</Text>
            </View>
          </View>

          <Spacer size="sm" />

          {memberCount > 0 && (
            <>
              <View style={styles.statusButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.memberStatusButton,
                    selectedStatuses.has('pending') ? styles.memberStatusButtonSelectedOrange : styles.memberStatusButtonUnselectedOrange,
                  ]}
                  onPress={() => {
                    // Toggle pending status without affecting the other
                    setSelectedStatuses(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has('pending')) {
                        newSet.delete('pending');
                      } else {
                        newSet.add('pending');
                      }
                      return newSet;
                    });
                    // TODO: Update member status via API
                  }}
                >
                  <Text style={
                    selectedStatuses.has('pending')
                      ? StyleSheet.flatten([styles.memberStatusButtonText, styles.memberStatusButtonTextSelected])
                      : StyleSheet.flatten([styles.memberStatusButtonText, styles.memberStatusButtonTextUnselectedOrange])
                  }>
                    {t.teams.new || 'ახალი'} ({pendingCount})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.memberStatusButton,
                    selectedStatuses.has('approved') ? styles.memberStatusButtonSelectedGreen : styles.memberStatusButtonUnselectedGreen,
                  ]}
                  onPress={() => {
                    // Toggle approved status without affecting the other
                    setSelectedStatuses(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has('approved')) {
                        newSet.delete('approved');
                      } else {
                        newSet.add('approved');
                      }
                      return newSet;
                    });
                    // TODO: Update member status via API
                  }}
                >
                  <Text style={
                    selectedStatuses.has('approved') 
                      ? StyleSheet.flatten([styles.memberStatusButtonText, styles.memberStatusButtonTextSelected])
                      : StyleSheet.flatten([styles.memberStatusButtonText, styles.memberStatusButtonTextUnselectedGreen])
                  }>
                    {t.teams.existing || 'არსებული'} ({approvedCount})
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.membersContainer}>
                <View style={styles.memberDivider} />
                <FlatList
                data={filteredMembers}
                renderItem={({ item, index }) => {
                  const statusColor = item.status === 'approved' ? '#16A34A' : '#EA580C';
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
                        <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
                        <View style={styles.memberContent}>
                          <UserAvatar
                            image={item.photo}
                            name={item.name}
                            size={48}
                            isDelegate={item.isDelegate}
                            isApproved={item.isApproved}
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
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {!isMember ? (
            <Button
              title={t.teams.joinTeam || 'გაწევრიანება'}
              onPress={handleJoin}
              variant="primary"
            />
          ) : null}
        </View>
      </View>

      <PasscodeApproveModal
        visible={showPasscodeModal}
        onRequestClose={() => setShowPasscodeModal(false)}
        onPasscodeComplete={handlePasscodeComplete}
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
    minHeight: 0,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
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
  infoContainer: {
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexShrink: 0,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 0,
  },
  membersContainer: {
    paddingHorizontal: 16,
    flex: 1,
    minHeight: 0,
    alignItems: 'flex-start',
  },
  membersList: {
    flex: 1,
    alignSelf: 'stretch',
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
  memberDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    alignSelf: 'stretch',
    marginLeft: 0,
  },
  memberStatusButton: {
    flex: 1,
    borderRadius: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  memberStatusButtonSelectedOrange: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  memberStatusButtonUnselectedOrange: {
    backgroundColor: 'transparent',
    borderColor: '#EA580C',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 1,
  },
  memberStatusButtonSelectedGreen: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  memberStatusButtonUnselectedGreen: {
    backgroundColor: 'transparent',
    borderColor: '#16A34A',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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
});

