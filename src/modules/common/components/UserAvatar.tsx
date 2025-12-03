import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from '../../../ui';
import { colors } from '../../../constants';
import { AntDesign } from '@expo/vector-icons';

interface UserAvatarProps {
  image?: string | null;
  name?: string;
  size?: number;
  isDelegate?: boolean;
  isApproved?: boolean;
  isLeader?: boolean;
  showBadges?: boolean;
}

export default function UserAvatar({
  image,
  name,
  size = 80,
  isDelegate = false,
  isApproved = false,
  isLeader = false,
  showBadges = true,
}: UserAvatarProps) {
  const avatarLetter = name?.charAt(0).toUpperCase() || 'U';
  const avatarImage = image || null;

  return (
    <View style={[styles.avatarWrapper, { width: size, height: size }]}>
      <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        {avatarImage ? (
          <Image
            source={{ uri: avatarImage }}
            style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.avatarText, { fontSize: size * 0.45 }]}>{avatarLetter}</Text>
        )}
      </View>
      {showBadges && (
        <>
          {isDelegate && (
            <View style={[styles.delegateBadge, { width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125 }]}>
              <AntDesign name="star" size={size * 0.18} color="#007AFF" />
            </View>
          )}
          {isLeader && (
            <View style={[styles.leaderBadge, { width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125, top: size * 0.375, right: -size * 0.12 }]}>
              <AntDesign name="flag" size={size * 0.15} color="#FFFFFF" />
            </View>
          )}
          <View
            style={[
              styles.memberBadge,
              {
                width: size * 0.25,
                height: size * 0.25,
                borderRadius: size * 0.125,
                backgroundColor: isApproved ? '#16A34A' : '#EA580C',
              },
            ]}
          >
            <AntDesign name="check" size={size * 0.125} color="#FFFFFF" />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: colors.avatarBackground,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    color: colors.avatarText,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  delegateBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  leaderBadge: {
    position: 'absolute',
    backgroundColor: '#DC2626',
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
  memberBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
});

