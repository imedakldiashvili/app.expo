import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { commonStyles } from '../../common';

interface ActionButtonProps {
  title: string;
  description: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
}

export default function ActionButton({
  title,
  description,
  onPress,
  variant = 'primary',
  disabled = false,
}: ActionButtonProps) {
  const { t } = useTranslation();

  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text variant="h3" style={commonStyles.nameText}>
            {title}
          </Text>
          <Text variant="body" color="secondary" style={commonStyles.labelText}>
            {description}
          </Text>
        </View>
        
        <Button
          title={t.actions.completeButton}
          variant={variant}
          size="small"
          onPress={onPress}
          disabled={disabled}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
});
