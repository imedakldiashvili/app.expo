import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../ui';

export const MainAdditionalList: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text variant="h3">MainAdditionalList</Text>
      <Text variant="body" color="secondary">
        This is a placeholder for the MainAdditionalList voting component.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});


