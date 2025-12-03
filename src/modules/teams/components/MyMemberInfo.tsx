import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from '../../../ui';
import { UserAvatar } from '../../common';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../../../constants';
import { useNavigation } from '@react-navigation/native';

interface Member {
  id: number;
  name: string;
  photo?: string;
  location?: string;
  isDelegate?: boolean;
  isApproved?: boolean;
  isLeader?: boolean;
}

interface MyMemberInfoProps {
  member: Member;
  team: any;
}

export default function MyMemberInfo({ member, team }: MyMemberInfoProps) {
  const navigation = useNavigation();

  if (!member || !member.name) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.memberDivider} />
        <View>
          <TouchableOpacity
            style={styles.memberItem}
            activeOpacity={0.7}
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                (parent as any).navigate('TeamMemberDetail', { member, team });
              } else {
                (navigation as any).navigate('TeamMemberDetail', { member, team });
              }
            }}
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
            <View style={styles.actionButton}>
              <AntDesign name="right" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginTop: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 0,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  memberDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    alignSelf: 'stretch',
    marginLeft: 0,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    alignSelf: 'stretch',
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
  actionButton: {
    marginLeft: 8,
  },
});

