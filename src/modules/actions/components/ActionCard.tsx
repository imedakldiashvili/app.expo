import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Spacer } from '../../../ui';
import { commonStyles } from '../../common';

interface ActionCardProps {
  title: string;
  description: string;
  buttonTitle: string;
  onPress: () => void;
}

export default function ActionCard({ title, description, buttonTitle, onPress }: ActionCardProps) {
  return (
    <Card style={styles.actionCard}>
      <Text variant="h2" style={styles.actionTitle}>
        {title}
      </Text>
      
      <Text variant="body" color="secondary" style={commonStyles.labelText}>
        {description}
      </Text>
      
      <Spacer size="md" />
      
      <Button
        title={buttonTitle}
        variant="outline"
        onPress={onPress}
        style={styles.actionButton}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    marginBottom: 16,
  },
  actionTitle: {
    marginBottom: 12,
  },
  actionButton: {
    width: '100%',
  },
});
