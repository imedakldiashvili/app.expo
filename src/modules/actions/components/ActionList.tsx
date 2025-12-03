import React from 'react';
import { View, StyleSheet } from 'react-native';
import ActionCard from './ActionCard';
import { useTranslation } from '../../../i18n';

export default function ActionList() {
  const { t } = useTranslation();

  const actions = [
    {
      id: 1,
      title: t.actions.action1,
      description: t.actions.action1Description,
      buttonTitle: t.actions.startButton,
    },
    {
      id: 2,
      title: t.actions.action2,
      description: t.actions.action2Description,
      buttonTitle: t.actions.continueButton,
    },
    {
      id: 3,
      title: t.actions.action3,
      description: t.actions.action3Description,
      buttonTitle: t.actions.completeButton,
    },
  ];

  const handleActionPress = (actionId: number) => {
    console.log(`Action ${actionId} pressed`);
  };

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <ActionCard
          key={action.id}
          title={action.title}
          description={action.description}
          buttonTitle={action.buttonTitle}
          onPress={() => handleActionPress(action.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
