import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Spacer, Card } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { colors } from '../../../constants';

type ActionStatus = 'inprogress' | 'done' | 'canceled';

interface RecentActionItem {
  id: number;
  actionName: string;
  actionTitle: string;
  status: ActionStatus;
  actionDate: string;
}

export default function RecentActions() {
  const { t } = useTranslation();

  const actions: RecentActionItem[] = [
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
    <View style={styles.container}>
      <Card style={styles.wrapperCard}>
        <View style={styles.header}>
          <Text variant="h3" style={styles.title}>
            {t.actions.recentActions}
          </Text>
        </View>
        <Spacer size="sm" />
        <View style={styles.topDivider} />
        <View style={styles.list}>
          {actions.map((action, index) => {
            const isLast = index === actions.length - 1;
            return (
              <View key={action.id}>
                <View style={styles.rowContainer}>
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
                {!isLast && <View style={styles.rowDivider} />}
              </View>
            );
          })}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  wrapperCard: {
    marginBottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
  },
  topDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 0,
  },
  list: {
    paddingTop: 8,
    paddingHorizontal: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderRadius: 8,
    marginVertical: 0,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginHorizontal: 0,
    marginTop: 4,
    marginBottom: 4,
  },
  statusBar: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionName: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  actionTitle: {
    lineHeight: 20,
    fontSize: 13,
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

