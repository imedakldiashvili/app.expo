import React from 'react';
import { StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container } from '../../../ui';
import { colors } from '../../../constants';
import { Title } from '../components';

interface SafeViewProps {
  children: React.ReactNode;
  title?: string;
  scrollable?: boolean;
  style?: ViewStyle;
}

export default function SafeView({ 
  children, 
  scrollable = true, 
  style 
}: SafeViewProps) {
  const content = (
    <Container style={StyleSheet.flatten([styles.container, style])}>
      {children}
    </Container>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {scrollable ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.safeAreaBackground,
  },
  container: {
    padding: 16,
  },
});
