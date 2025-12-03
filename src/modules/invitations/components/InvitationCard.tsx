import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Text } from '../../../ui';
import { UserAvatar } from '../../common';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../../../constants';
import { Invitation } from '../interfaces';

interface InvitationCardProps {
  invitation: Invitation;
  onPress: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

export default function InvitationCard({
  invitation,
  onPress,
  onAccept,
  onReject,
}: InvitationCardProps) {
  const getStatusColor = () => {
    switch (invitation.status) {
      case 'pending':
        return '#EA580C'; // ნარინჯისფერი - ახალი
      case 'accepted':
        return '#16A34A'; // მწვანე - დასრულებული
      case 'rejected':
        return '#D1D5DB'; // ღია ნაცრისფერი - გაუქმებული
      default:
        return '#D1D5DB';
    }
  };

  const getTimeRemaining = (dateString?: string) => {
    if (!dateString) return '';
    const expiryDate = new Date(dateString);
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    
    // თუ სტატუსი pending არის, ვადა გაუვიდა არ უნდა გამოჩნდეს
    if (diff <= 0 && invitation.status === 'pending') return '';
    if (diff <= 0) return 'ვადა გაუვიდა';
    
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // ფორმატი: HH:MM
    const hoursStr = totalHours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    
    return `${hoursStr}:${minutesStr}`;
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.rowContainer}>
          <View style={[styles.statusBar, { backgroundColor: getStatusColor() }]} />
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text variant="body" style={styles.name}>
                {invitation.fromUser.name}
              </Text>
              {invitation.fromUser.mobileNumber && (
                <Text variant="body" color="secondary" style={styles.mobileNumber}>
                  {invitation.fromUser.mobileNumber}
                </Text>
              )}
            </View>
            {invitation.expiryDate && (
              <Text variant="body" color="secondary" style={styles.expiryDate}>
                {getTimeRemaining(invitation.expiryDate)}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 0,
  },
  statusBar: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  mobileNumber: {
    fontSize: 13,
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: 13,
    marginLeft: 8,
  },
});

