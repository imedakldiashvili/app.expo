import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Spacer } from '../../../ui';
import { ScreenView } from '../../common';
import { useTranslation } from '../../../i18n';
import { colors } from '../../../constants';

type ActionStatus = 'inprogress' | 'done' | 'canceled';

interface ActionItem {
  id: number;
  actionName: string;
  actionTitle: string;
  status: ActionStatus;
  actionDate: string;
}

export default function ActionListScreen() {
  const { t } = useTranslation();

  const actions: ActionItem[] = [
    {
      id: 1,
      actionName: 'Online rating',
      actionTitle: t.actions.action1,
      status: 'inprogress',
      actionDate: '2025-01-01',
    },
    {
      id: 2,
      actionName: 'My politicians',
      actionTitle: t.actions.action2,
      status: 'done',
      actionDate: '2025-01-02',
    },
    {
      id: 3,
      actionName: 'Teams',
      actionTitle: t.actions.action3,
      status: 'canceled',
      actionDate: '2025-01-03',
    },
    {
      id: 4,
      actionName: 'Action 4',
      actionTitle: t.actions.action1,
      status: 'inprogress',
      actionDate: '2025-01-04',
    },
    {
      id: 5,
      actionName: 'Action 5',
      actionTitle: t.actions.action2,
      status: 'done',
      actionDate: '2025-01-05',
    },
    {
      id: 6,
      actionName: 'Action 6',
      actionTitle: t.actions.action3,
      status: 'canceled',
      actionDate: '2025-01-06',
    },
    {
      id: 7,
      actionName: 'Action 7',
      actionTitle: t.actions.action1,
      status: 'inprogress',
      actionDate: '2025-01-07',
    },
    {
      id: 8,
      actionName: 'Action 8',
      actionTitle: t.actions.action2,
      status: 'done',
      actionDate: '2025-01-08',
    },
    {
      id: 9,
      actionName: 'Action 9',
      actionTitle: t.actions.action3,
      status: 'canceled',
      actionDate: '2025-01-09',
    },
    {
      id: 10,
      actionName: 'Action 10',
      actionTitle: t.actions.action1,
      status: 'inprogress',
      actionDate: '2025-01-10',
    },
    {
      id: 11,
      actionName: 'Action 11',
      actionTitle: t.actions.action2,
      status: 'done',
      actionDate: '2025-01-11',
    },
    {
      id: 12,
      actionName: 'Action 12',
      actionTitle: t.actions.action3,
      status: 'canceled',
      actionDate: '2025-01-12',
    },
    {
      id: 13,
      actionName: 'Action 13',
      actionTitle: t.actions.action1,
      status: 'inprogress',
      actionDate: '2025-01-13',
    },
    {
      id: 14,
      actionName: 'Action 14',
      actionTitle: t.actions.action2,
      status: 'done',
      actionDate: '2025-01-14',
    },
    {
      id: 15,
      actionName: 'Action 15',
      actionTitle: t.actions.action3,
      status: 'canceled',
      actionDate: '2025-01-15',
    },
    {
      id: 16,
      actionName: 'Action 16',
      actionTitle: t.actions.action1,
      status: 'inprogress',
      actionDate: '2025-01-16',
    },
    {
      id: 17,
      actionName: 'Action 17',
      actionTitle: t.actions.action2,
      status: 'done',
      actionDate: '2025-01-17',
    },
    {
      id: 18,
      actionName: 'Action 18',
      actionTitle: t.actions.action3,
      status: 'canceled',
      actionDate: '2025-01-18',
    },
    {
      id: 19,
      actionName: 'Action 19',
      actionTitle: t.actions.action1,
      status: 'inprogress',
      actionDate: '2025-01-19',
    },
    {
      id: 20,
      actionName: 'Action 20',
      actionTitle: t.actions.action2,
      status: 'done',
      actionDate: '2025-01-20',
    },
  ];

  const statusStyle = (status: ActionStatus) => {
    switch (status) {
      case 'inprogress':
        return styles.statusInProgress;
      case 'done':
        return styles.statusDone;
      case 'canceled':
        return styles.statusCanceled;
    }
  };

  return (
    <ScreenView scrollable={false}>
      <Text variant="h2" align="center" style={styles.title}>
        {t.actions.allActions}
      </Text>
      <Spacer size="md" />
      <View style={styles.container}>
        <ScrollView 
          style={styles.list} 
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {actions.map((action, index) => (
            <View
              key={action.id}
              style={[
                styles.rowContainer,
                index === 0 && styles.rowTopDivider,
                index < actions.length - 1 && styles.rowDivider,
              ]}
            >
              <View style={[styles.statusBar, statusStyle(action.status)]} />
              <View style={styles.content}>
                <View style={styles.headerRow}>
                  <Text variant="body" style={styles.actionName}>
                    {action.actionName}
                  </Text>
                  <Text
                    variant="body"
                    color="secondary"
                    style={styles.actionDate}
                  >
                    {new Date(action.actionDate).toLocaleDateString('ka-GE', { 
                      day: '2-digit', 
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                <Spacer size="xs" />
                <Text
                  variant="body"
                  color="secondary"
                  style={styles.actionTitle}
                >
                  {action.actionTitle}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  title: {
    marginBottom: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  rowTopDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  statusBar: {
    width: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionName: {
    fontWeight: '600',
    flex: 1,
  },
  actionTitle: {
    lineHeight: 20,
  },
  actionDate: {
    fontSize: 12,
    marginLeft: 8,
  },
  statusInProgress: {
    backgroundColor: '#EA580C', // orange
  },
  statusDone: {
    backgroundColor: '#16A34A', // green
  },
  statusCanceled: {
    backgroundColor: '#9CA3AF', // gray
  },
});
