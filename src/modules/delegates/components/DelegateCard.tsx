import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Spacer } from '../../../ui';
import { MockUser } from '../../../api/mockData';
import { commonStyles } from '../../common';

interface DelegateCardProps {
  delegate: MockUser;
}

export default function DelegateCard({ delegate }: DelegateCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        {delegate.image && (
          <Image source={{ uri: delegate.image }} style={styles.avatar} />
        )}
        <View style={styles.textContainer}>
          <Text variant="h3" style={commonStyles.nameText}>
            {delegate.person?.fullName || delegate.userName}
          </Text>
          <Spacer size="xs" />
          <Text variant="body" color="secondary" style={commonStyles.labelText}>
            {delegate.email}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
});

