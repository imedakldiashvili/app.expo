import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../ui';
import { commonStyles } from '../../common';

interface ElectionTitleProps {
  name: string;
  description?: string;
}

export default function ElectionTitle({
  name,
  description,
}: ElectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3" align="center" style={styles.title}>
        {name}
      </Text>
      {description && (
        <Text variant="body" color="secondary" align="center" style={commonStyles.labelText}>
          {description}
        </Text>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
  },
});

