import React from "react";
import { StyleSheet } from "react-native";
import { ActionButton, Text } from "../../../ui";
import { useNavigation } from "@react-navigation/native";
import { useSelection, useAuth } from "../../../contexts";
import { Election } from "../../../api/mockData";

interface ElectionsListProps {
  style?: any;
  activeElections: Election[];
}

export default function ElectionsList({ style, activeElections }: ElectionsListProps) {
  const navigation = useNavigation();
  const { location } = useSelection() as any;
  const { user } = useAuth();

  return (
    <>
      {activeElections.map((election) => (
        <ActionButton
          key={election.id}
          id={election.id}
          leftContent={
            <Text variant="body" style={styles.voteIcon}>
              👉
            </Text>
          }
          label={election.description}
          title={election.name}
          onPress={(id) => {
            if (!location) {
              (navigation as any).navigate("SelectLocation", {
                returnTo: "ElectionMain",
                returnParams: { electionId: id },
              });
              return;
            }
            (navigation as any).navigate("ElectionMain", { electionId: id });
          }}
          style={[styles.ratingCard, style]}
          disabled={!user?.isVerified}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  ratingCard: {
    marginBottom: 4,
  },
  voteIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
});

