import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenView } from '../../common';
import { Text, Spacer } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { useAuth } from '../../../contexts';
import { InvitationCard } from '../components';
import { Invitation } from '../interfaces';

// Mock data - in real app this would come from API
const getMockInvitations = (userId: string): Invitation[] => {
  const now = new Date();
  const futureDate1 = new Date(now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000); // 5 საათი, 30 წუთი
  const futureDate2 = new Date(now.getTime() + 12 * 60 * 60 * 1000 + 15 * 60 * 1000); // 12 საათი, 15 წუთი
  const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 დღე წინ (accepted-ისთვის)
  
  return [
    {
      id: 1,
      fromUser: {
        id: '2',
        name: 'გიორგი ბერიძე',
        photo: 'https://i.pravatar.cc/150?img=1',
        mobileNumber: '+995555123456',
        team: {
          id: 2,
          name: 'საქართველოს ოცნება',
          logo: 'https://picsum.photos/seed/dream/200/200',
        },
      },
      team: {
        id: 2,
        name: 'საქართველოს ოცნება',
        logo: 'https://picsum.photos/seed/dream/200/200',
        type: 'party',
      },
      status: 'pending',
      createdAt: now.toISOString(),
      expiryDate: futureDate1.toISOString(),
      message: 'გთხოვთ შემოგვიერთდეთ ჩვენს გუნდს',
    },
    {
      id: 2,
      fromUser: {
        id: '3',
        name: 'მარიამ ლომიძე',
        photo: 'https://i.pravatar.cc/150?img=2',
        mobileNumber: '+995555234567',
        team: {
          id: 3,
          name: 'ერთიანი ნაციონალური მოძრაობა',
          logo: 'https://picsum.photos/seed/unm/200/200',
        },
      },
      team: {
        id: 3,
        name: 'ერთიანი ნაციონალური მოძრაობა',
        logo: 'https://picsum.photos/seed/unm/200/200',
        type: 'movement',
      },
      status: 'pending',
      createdAt: now.toISOString(),
      expiryDate: futureDate2.toISOString(),
    },
    {
      id: 3,
      fromUser: {
        id: '4',
        name: 'ნიკა კვარაცხელია',
        photo: 'https://i.pravatar.cc/150?img=3',
        mobileNumber: '+995555345678',
        team: {
          id: 4,
          name: 'სამოქალაქო ალიანსი',
          logo: 'https://picsum.photos/seed/alliance/200/200',
        },
      },
      team: {
        id: 4,
        name: 'სამოქალაქო ალიანსი',
        logo: 'https://picsum.photos/seed/alliance/200/200',
        type: 'ngo',
      },
      status: 'accepted',
      createdAt: pastDate.toISOString(),
      expiryDate: new Date(pastDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

export default function InvitationsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    if (user?.id) {
      const mockInvitations = getMockInvitations(user.id);
      setInvitations(mockInvitations);
    }
  }, [user?.id]);

  const handleAccept = (invitationId: number) => {
    // TODO: Call API to accept invitation
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: 'accepted' as const } : inv
      )
    );
  };

  const handleReject = (invitationId: number) => {
    // TODO: Call API to reject invitation
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: 'rejected' as const } : inv
      )
    );
  };

  const handlePress = (invitation: Invitation) => {
    // TODO: Navigate to invitation detail or team details
    console.log('Invitation pressed:', invitation);
  };

  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending');
  const otherInvitations = invitations.filter((inv) => inv.status !== 'pending');

  return (
    <ScreenView scrollable={false}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {pendingInvitations.length > 0 && (
          <>
            <Text variant="h3" style={styles.sectionTitle}>
              {t.invitations?.pending || 'მოწვევები'}
            </Text>
            <Spacer size="sm" />
            {pendingInvitations.map((item) => (
              <InvitationCard
                key={`pending-${item.id}`}
                invitation={item}
                onPress={() => handlePress(item)}
                onAccept={() => handleAccept(item.id)}
                onReject={() => handleReject(item.id)}
              />
            ))}
            <Spacer size="md" />
          </>
        )}

        {otherInvitations.length > 0 && (
          <>
            <Text variant="h3" style={styles.sectionTitle}>
              {t.invitations?.history || 'ისტორია'}
            </Text>
            <Spacer size="sm" />
            {otherInvitations.map((item) => (
              <InvitationCard
                key={`other-${item.id}`}
                invitation={item}
                onPress={() => handlePress(item)}
              />
            ))}
          </>
        )}

        {invitations.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text variant="body" color="secondary" align="center">
              {t.invitations?.empty || 'მოწვევები არ არის'}
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    minHeight: 200,
  },
});

