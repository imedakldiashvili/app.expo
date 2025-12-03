import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet as RNStyleSheet } from 'react-native';
import { Text, Spacer, Button, Card, ActionStarButton } from '../../../ui';
import { ScreenView } from '../../common';
import { UserInfo } from '../../profile';
import { useTranslation } from '../../../i18n';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../../contexts';
import { colors } from '../../../constants';
import { AntDesign } from '@expo/vector-icons';
import { getDelegates } from '../../../api';
import { MockUser, mockUsers } from '../../../api/mockData';
import { UserAvatar } from '../../common';
import { ElectionSupporters } from '../components';

// Member types
type MemberRole = 'admin' | 'approver' | 'member';
type MemberStatus = 'pending' | 'approved';

interface Member {
  id: number;
  name: string;
  photo?: string;
  role: MemberRole;
  status: MemberStatus;
}

export default function TeamMemberDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const member = (route.params as any)?.member as Member | undefined;
  const team = (route.params as any)?.team;

  const [isApprover, setIsApprover] = useState(member?.role === 'approver');
  const [isLeader, setIsLeader] = useState(member?.role === 'admin');
  // Find mockUser for this member
  const mockUser = member?.id ? mockUsers.find(u => u.id === member.id.toString() || parseInt(u.id) === member.id) : undefined;
  
  const [isDelegate, setIsDelegate] = useState(() => {
    return mockUser ? mockUser.teamMember.isDelegate === true : false;
  });
  const [referrals, setReferrals] = useState<MockUser[]>([]);
  const [delegate, setDelegate] = useState<MockUser | null>(null);
  const [supporters, setSupporters] = useState<MockUser[]>([]);

  // Check if this is the current user
  const isCurrentUser = user && member && (parseInt(user.id) === member.id || user.id === member.id.toString());

  // Load referrals for this member and update isDelegate
  useEffect(() => {
    if (member?.id) {
      const memberReferrals = getDelegates(member.id.toString());
      setReferrals(memberReferrals);
      
      // Find delegate (user who is the delegate for this member)
      // delegateId in MockUser points to the delegate's id
      const memberDelegate = mockUser?.delegateId 
        ? mockUsers.find(u => parseInt(u.id) === mockUser.delegateId)
        : null;
      setDelegate(memberDelegate || null);
      
      // Find supporters (users whose delegateId = memberId) - only for current user
      if (isCurrentUser) {
        const memberId = parseInt(member.id.toString());
        const userSupporters = mockUsers.filter(u => u.delegateId === memberId);
        setSupporters(userSupporters);
      }
      
      // Update isDelegate from MockUser
      if (mockUser && mockUser.teamMember.isDelegate === true) {
        setIsDelegate(true);
      }
    }
  }, [member?.id, mockUser, isCurrentUser]);

  if (!member) {
    return (
      <ScreenView scrollable={true}>
        <Text variant="h2" align="center">{t.teams.memberNotFound || 'წევრი ვერ მოიძებნა'}</Text>
      </ScreenView>
    );
  }

  // Calculate isApproved first, then isPending based on it
  const isApproved = mockUser ? mockUser.teamMember.isApproved : member.status === 'approved';
  const isPending = !isApproved;
  
  // Check if current user is a leader
  const isCurrentUserLeader = user ? user.teamMember.isLeader : false;

  const handleApprove = () => {
    // TODO: Call API to approve member
    Alert.alert(
      t.teams.memberApproved || 'დასტური',
      t.teams.memberApprovedMessage?.replace('{name}', member.name) || `${member.name} დადასტურებულია`,
      [
        {
          text: t.common.confirm || 'დადასტურება',
          onPress: () => {
            // Navigate back
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleReject = () => {
    // TODO: Call API to reject member
    Alert.alert(
      t.teams.memberRejected || 'უარი',
      t.teams.memberRejectedMessage?.replace('{name}', member.name) || `${member.name} უარყოფილია`,
      [
        {
          text: t.common.confirm || 'დადასტურება',
          onPress: () => {
            // Navigate back
            navigation.goBack();
          }
        }
      ]
    );
  };


  const handleApproverToggle = (value: boolean) => {
    setIsApprover(value);
    // TODO: Call API to update member role
  };

  const handleLeaderToggle = (value: boolean) => {
    setIsLeader(value);
    // TODO: Call API to update member role
  };

  const handleDelegateToggle = (value: boolean) => {
    setIsDelegate(value);
    // TODO: Call API to update delegate status
  };

  return (
    <ScreenView scrollable={false}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Hero Section with User Info */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <UserInfo
                user={{
                  id: member.id.toString(),
                name: member.name,
                email: mockUser ? mockUser.email : '',
                fullName: mockUser?.person?.fullName || member.name,
                image: member.photo || mockUser?.image || null,
                isVerified: mockUser ? mockUser.isVerified : false,
                isDelegate: isDelegate,
                isMember: member.status === 'approved', // approved members are members
                teamMember: {
                  team: (mockUser ? mockUser.teamMember.team : null) || team || {
                    id: 1,
                    name: 'გუნდის გარეშე',
                    type: 'ngo',
                  },
                  isApproved: isApproved,
                  isDelegate: isDelegate,
                  isLeader: mockUser ? mockUser.teamMember.isLeader : false,
                },
                person: mockUser ? mockUser.person : {
                  personalId: '',
                  fullName: member.name,
                },
              }}
                delegates={referrals.map(r => ({ id: r.id, image: r.image || null }))}
                currentTeam={team}
                location={mockUser ? mockUser.location.name : null}
                onDelegatesPress={() => {
                  // TODO: Navigate to referrals list
                }}
                onTeamPress={() => {
                  if (team) {
                    const parent = navigation.getParent();
                    if (parent) {
                      (parent as any).navigate('TeamDetails', { team });
                    } else {
                      (navigation as any).navigate('TeamDetails', { team });
                    }
                  }
                }}
              />
            </View>
          </View>
        
        <View style={styles.content}>
          {/* Pending Status - Approve Button */}
          {isPending && isCurrentUserLeader && (
            <View style={styles.actionsContainer}>
              <View style={styles.buttonRow}>
                <Button
                  title={t.teams.approve || 'დასტური'}
                  onPress={handleApprove}
                  variant="primary"
                  style={styles.approveButton}
                />
              </View>
              <Spacer size="md" />
            </View>
          )}

          {/* Delegate Toggle - Only for current user */}
          {isCurrentUser && (
            <>
              <ActionStarButton
                id={member.id}
                title="დელეგატი"
                value={isDelegate}
                onValueChange={handleDelegateToggle}
                disabled={!user?.isVerified}
                style={{ borderWidth: 1, borderColor: colors.borderLight, borderRadius: 12, marginBottom: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
              />

            </>
          )}

        </View>

        {/* Referral - Only for current user */}
        {isCurrentUser && (
          <>
            <Card style={styles.referralsCard}>
              {/* Card Title */}
              <View style={styles.referralsCardHeader}>
                <Text variant="h3" style={styles.referralsCardTitle}>
                  რეფერალი
                </Text>
              </View>
              
              {/* My Choice Section */}
              <View style={styles.referralSection}>
                {delegate ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={!user?.isVerified}
                    onPress={() => {
                      if (!user?.isVerified || !team) return;
                      const parent = navigation.getParent();
                      if (parent) {
                        (parent as any).navigate('TeamMemberDetail', {
                          member: {
                            id: parseInt(delegate.id),
                            name: delegate.person?.fullName || delegate.userName,
                            photo: delegate.image,
                            role: 'member' as const,
                            status: delegate.teamMember.isApproved ? 'approved' as const : 'pending' as const,
                          },
                          team: delegate.teamMember.team,
                        });
                      } else {
                        (navigation as any).navigate('TeamMemberDetail', {
                          member: {
                            id: parseInt(delegate.id),
                            name: delegate.person?.fullName || delegate.userName,
                            photo: delegate.image,
                            role: 'member' as const,
                            status: delegate.teamMember.isApproved ? 'approved' as const : 'pending' as const,
                          },
                          team: delegate.teamMember.team,
                        });
                      }
                    }}
                  >
                    <View style={styles.referralsContent}>
                      <View style={styles.referralsLeft}>
                        <Text variant="body" color="secondary" style={StyleSheet.flatten([styles.delegateLabel, !user?.isVerified && styles.disabledText])}>
                          ჩემი არჩევანი
                        </Text>
                        <View style={styles.delegateInfoContainer}>
                          <Image
                            source={{ uri: delegate.image || 'https://i.pravatar.cc/150?img=1' }}
                            style={[styles.delegateImage, !user?.isVerified && styles.disabledImage]}
                          />
                          <View style={styles.delegateTextContainer}>
                            <Text variant="body" style={StyleSheet.flatten([styles.delegateName, !user?.isVerified && styles.disabledText])}>
                              {delegate.person?.fullName || delegate.userName}
                            </Text>
                            {delegate.location && (
                              <Text variant="body" color="secondary" style={StyleSheet.flatten([styles.delegateLocation, !user?.isVerified && styles.disabledText])}>
                                {delegate.location.name}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                      <View style={styles.referralsIconContainer}>
                        <AntDesign name="right" size={16} color={!user?.isVerified ? '#D1D5DB' : '#9CA3AF'} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={!user?.isVerified}
                    onPress={() => {
                      if (!user?.isVerified) return;
                      // TODO: Navigate to delegate selection screen
                    }}
                  >
                  <View style={styles.referralsContent}>
                    <View style={styles.referralsLeft}>
                      <Text variant="body" color="secondary" style={StyleSheet.flatten([styles.delegateLabel, !user?.isVerified && styles.disabledText])}>
                        ჩემი არჩევანი
                      </Text>
                      <Text variant="body" color="secondary" style={StyleSheet.flatten([styles.selectDelegateText, !user?.isVerified && styles.disabledText])}>
                        აირჩიე რეფერალი
                      </Text>
                    </View>
                      <View style={styles.referralsIconContainer}>
                        <AntDesign name="right" size={16} color={!user?.isVerified ? '#D1D5DB' : '#9CA3AF'} />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {/* Divider */}
              <View style={styles.referralsDivider} />

              {/* My Referrals Section */}
              <View style={styles.referralsListSection}>
                  <View style={styles.referralsListHeader}>
                  <Text variant="h3" style={StyleSheet.flatten([styles.referralsListTitle, !user?.isVerified && styles.disabledText])}>
                    ჩემი რეფერალები
                  </Text>
                  <View style={styles.referralsListIconContainer}>
                    <AntDesign name="right" size={16} color={!user?.isVerified ? '#D1D5DB' : '#9CA3AF'} />
                  </View>
                </View>
                {supporters.length > 0 ? (
                  <View style={styles.supportersImagesContainer}>
                    {supporters
                      .slice(0, 10)
                      .map((supporter, index) => (
                        <Image
                          key={supporter.id}
                          source={{ uri: supporter.image || 'https://i.pravatar.cc/150?img=' + (index + 1) }}
                          style={[
                            styles.supporterImage,
                            index > 0 && styles.supporterImageOverlap,
                            !user?.isVerified && styles.disabledImage,
                          ]}
                        />
                      ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Text variant="body" color="secondary" style={StyleSheet.flatten([styles.emptyStateText, !user?.isVerified && styles.disabledText])}>
                      მოიწვიე მხარდამჭერები
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          </>
        )}

        {/* Election Supporters */}
        <Spacer size="md" />
        <ElectionSupporters electionId={1} />

      </View>
      </ScrollView>
      
      {/* Fixed Back Button */}
      <View style={styles.fixedButtonContainer}>
        <Button
          title="უკან"
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.fixedButton}
        />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for fixed button
  },
  container: {
    flexDirection: 'column',
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
  content: {
    paddingHorizontal: 4,
    paddingTop: 20,
    paddingBottom: 20,
  },
  photoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: '600',
    color: '#6B7280',
  },
  delegateBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
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
  name: {
    fontWeight: '600',
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    minWidth: 40,
    minHeight: 40,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionsContainer: {
    width: '100%',
    paddingHorizontal: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
  },
  approveButton: {
    flex: 1,
  },
  switchContainer: {
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
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
  referralsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  referralsLeft: {
    flex: 1,
    flexDirection: 'column',
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
  referralsIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  delegateInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
  },
  delegateImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 12,
  },
  delegateTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  delegateName: {
    fontWeight: '500',
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 18,
  },
  delegateLocation: {
    fontSize: 12,
    marginTop: 0,
    lineHeight: 16,
  },
  delegateLabel: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 15,
  },
  selectDelegateText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  inviteSupporterText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  fixedButton: {
    width: '100%',
  },
  myDelegateCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  referralsCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  referralsCardHeader: {
    marginBottom: 16,
  },
  referralsCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
  },
  referralSection: {
    marginBottom: 0,
  },
  referralsDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
    marginHorizontal: 0,
  },
  referralsListSection: {
    marginTop: 0,
  },
  referralsListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  referralsListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
  },
  referralsListIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportersImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 0,
  },
  supporterImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  supporterImageOverlap: {
    marginLeft: -8,
  },
  emptyStateContainer: {
    paddingTop: 0,
  },
  emptyStateText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  disabledImage: {
    opacity: 0.5,
  },
});

