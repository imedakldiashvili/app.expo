import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Spacer } from '../../../ui';
import { colors } from '../../../constants';
import { useTranslation } from '../../../i18n';
import { UserAvatar } from '../../common';

interface ProfileCardProps {
  user: {
    name?: string;
    email?: string;
    fullName?: string | null;
    image?: string | null;
    person?: {
      personalId: string;
      fullName: string;
    } | null;
  } | null;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const { t } = useTranslation();

  const displayEmail = user?.email;
  const displayName = user?.name;
  const displayFullName = user?.person?.fullName;
  const avatarImage = user?.image || null;

  return (
    <>

      <Card padding="small" shadow={false} style={styles.profileCard}>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text variant="h2" style={styles.userName}>
              {displayName}
            </Text>
            {displayFullName && (
              <Text variant="body" color="secondary" style={styles.fullName}>
                {displayFullName}
              </Text>
            )}
          </View>

          <UserAvatar
            image={avatarImage}
            name={displayName || displayFullName || ''}
            size={80}
            isDelegate={false}
            isApproved={false}
            showBadges={false}
          />
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  profileCard: {

    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.avatarBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatarText: {
    color: colors.avatarText,
    fontSize: 32,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  info: {
    flex: 1,
  },
  userName: {
    marginBottom: 4,
  },
  userEmailTop: {
    marginBottom: 4,
  },
  fullName: {
    marginTop: 2,
  },
});
