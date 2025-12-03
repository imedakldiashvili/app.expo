import React from 'react';
import { StyleSheet, ScrollView, ViewStyle, View } from 'react-native';
import { Container } from '../../../ui';
import { colors } from '../../../constants';

interface ScreenViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export default function ScreenView({ 
  children, 
  scrollable = true, 
  style 
}: ScreenViewProps) {
  const contentStyle = scrollable 
    ? styles.content 
    : [styles.content, styles.contentFlex];

  const content = (
    <View style={[contentStyle, style]}>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      {scrollable ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  contentFlex: {
    flex: 1,
  },
});
