import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Spacer, Button } from '../../../ui';
import TeamRow from './TeamRow';
import { Team } from './TeamCard';
import { colors } from '../../../constants';

interface TeamListProps {
  allTeams: Team[];
  currentTeamId?: number | null;
  onTeamPress?: (team: Team) => void;
  onTeamJoin?: (team: Team) => void;
  onCurrentTeamPress?: (team: Team) => void;
  title?: string;
  showCurrentTeam?: boolean;
  currentTeamLabel?: string;
  otherTeamsLabel?: string;
  onEndReached?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

export default function TeamList({
  allTeams,
  currentTeamId,
  onTeamPress,
  onTeamJoin,
  onCurrentTeamPress,
  title,
  showCurrentTeam = false,
  currentTeamLabel,
  otherTeamsLabel,
  onEndReached,
  hasMore = false,
  isLoading = false,
  buttonTitle,
  onButtonPress,
}: TeamListProps) {
  // Get current team object
  const currentTeam = useMemo(() => {
    if (currentTeamId) {
      return allTeams.find(t => t.id === currentTeamId) || null;
    }
    return null;
  }, [currentTeamId, allTeams]);

  // Filter teams: exclude only current team
  const filteredTeams = useMemo(() => {
    return allTeams.filter(team => {
      // Exclude current team
      if (currentTeamId && team.id === currentTeamId) return false;
      return true;
    });
  }, [allTeams, currentTeamId]);

  // Sort teams: joined first, then others
  const sortedTeams = useMemo(() => {
    return [...filteredTeams].sort((a, b) => {
      if (a.isMember && !b.isMember) return -1;
      if (!a.isMember && b.isMember) return 1;
      return 0;
    });
  }, [filteredTeams]);

  const renderTeam = useCallback(({ item, index }: { item: Team; index: number }) => {
    const isLast = index === sortedTeams.length - 1;
    return (
      <TeamRow
        team={item}
        onPress={() => onTeamPress?.(item)}
        isLast={isLast}
      />
    );
  }, [onTeamPress, sortedTeams.length]);

  const renderCurrentTeamSection = () => {
    if (!(showCurrentTeam && currentTeam)) return null;
    return (
      <View style={styles.currentTeamWrapper}>
        <View style={styles.currentTeamContainer}>
          {currentTeamLabel && (
            <>
              <View style={styles.sectionLabelContainer}>
                <Text variant="h3" style={styles.sectionLabel}>
                  {currentTeamLabel}
                </Text>
              </View>
              <View style={styles.labelDivider} />
            </>
          )}
          <View style={styles.currentTeamCardWrapper}>
            <TeamRow 
              team={currentTeam} 
              onPress={() => onCurrentTeamPress?.(currentTeam)}
              isLast
            />
          </View>
        </View>
      </View>
    );
  };

  const renderTeamsList = (showLabel: boolean) => (
    <View style={[styles.teamsListWrapper, styles.teamsListWrapperFlex]}>
      <View style={[styles.teamsListContainer, styles.teamsListContainerFlex]}>
        {showLabel && otherTeamsLabel && (
          <>
            <View style={styles.sectionLabelContainer}>
              <Text variant="h3" style={styles.sectionLabel}>
                {otherTeamsLabel}
              </Text>
            </View>
            <View style={styles.labelDivider} />
          </>
        )}
        <FlatList
          style={styles.scrollableList}
          data={sortedTeams}
          renderItem={renderTeam}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          nestedScrollEnabled
          ListFooterComponent={
            isLoading && hasMore ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {title && (
        <>
          <Text variant="h3">{title}</Text>
          <Spacer size="md" />
        </>
      )}
      
      {renderCurrentTeamSection()}
      
      {buttonTitle && onButtonPress && (
        <View style={styles.buttonContainer}>
          <Button
            title={buttonTitle}
            onPress={onButtonPress}
            style={styles.button}
          />
        </View>
      )}
      
      {renderTeamsList(Boolean(otherTeamsLabel))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  currentTeamWrapper: {
    marginTop: -15,
  },
  teamsListWrapper: {
    marginTop: 6,
  },
  teamsListWrapperFlex: {
    flex: 1,
  },
  currentTeamContainer: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    paddingBottom: 4,
  },
  teamsListContainer: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    paddingBottom: 4,
  },
  teamsListContainerFlex: {
    flex: 1,
  },
  sectionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'left',
  },
  labelDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 12,
  },
  currentTeamCardWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  scrollableList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
  button: {
    width: '100%',
  },
});

