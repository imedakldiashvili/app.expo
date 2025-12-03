import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from '../../../ui';
import { UserAvatar } from '../../common';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../../i18n';

interface Member {
  id: number;
  name: string;
  photo?: string;
  location?: string;
  isDelegate?: boolean;
  isApproved?: boolean;
  isLeader?: boolean;
  status?: 'pending' | 'approved';
  role?: 'admin' | 'approver' | 'member';
}

interface MyTeamLeaderProps {
  leaders: Member[];
  team: any;
}

export default function MyTeamLeader({ leaders, team }: MyTeamLeaderProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  if (leaders.length === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        // TODO: Navigate to leaders list
      }}
    >
      <Card style={styles.card}>
        <View style={styles.membersContent}>
          <View style={styles.membersLeft}>
            <View style={styles.membersLabelRow}>
              <View style={styles.labelIconContainerFlag}>
                <AntDesign name="flag" size={12} color="#FFFFFF" />
              </View>
              <Text variant="body" color="secondary" style={styles.membersLabel}>
                ლიდერი
              </Text>
            </View>
            <View style={styles.membersListContainer}>
              {leaders.map((member, index) => (
                <TouchableOpacity
                  key={`leader-${member.id}`}
                  activeOpacity={0.7}
                  onPress={(e) => {
                    e.stopPropagation();
                    const parent = navigation.getParent();
                    if (parent) {
                      (parent as any).navigate('TeamMemberDetail', { member, team });
                    } else {
                      (navigation as any).navigate('TeamMemberDetail', { member, team });
                    }
                  }}
                  style={styles.memberItem}
                >
                  <View style={styles.memberContent}>
                    <UserAvatar
                      image={member.photo}
                      name={member.name}
                      size={48}
                      isDelegate={member.isDelegate}
                      isApproved={member.isApproved}
                      isLeader={member.isLeader}
                      showBadges={true}
                    />
                    <View style={styles.memberTextContainer}>
                      <Text variant="body" style={styles.memberName}>
                        {member.name || ''}
                      </Text>
                      {member.location && (
                        <Text variant="body" color="secondary" style={styles.memberLocation}>
                          {member.location}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.membersIconContainer}>
            <AntDesign name="right" size={16} color="#9CA3AF" />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
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
    marginBottom: 0,
  },
  labelIconContainerFlag: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  membersLabel: {
    fontWeight: '600',
    fontSize: 15,
  },
  membersListContainer: {
    flexDirection: 'column',
    paddingTop: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
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
  memberName: {
    fontWeight: '500',
  },
  memberLocation: {
    fontSize: 13,
    marginTop: 2,
  },
  membersIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

