import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";

type EmptyStateProps = {
  title: string;
  copy: string;
};

export function EmptyState({ title, copy }: EmptyStateProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.copy}>{copy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing[1],
    padding: spacing[4],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  copy: {
    color: colors.muted,
    lineHeight: 22,
  },
});
