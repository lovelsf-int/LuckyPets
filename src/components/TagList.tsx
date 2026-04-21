import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";

type TagListProps = {
  items: string[];
  tone?: "accent" | "success";
};

export function TagList({ items, tone = "accent" }: TagListProps) {
  return (
    <View style={styles.tags}>
      {items.map((item) => (
        <Text key={item} style={[styles.tag, tone === "success" && styles.successTag]}>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[1],
  },
  tag: {
    overflow: "hidden",
    paddingHorizontal: spacing[2],
    paddingVertical: 7,
    borderRadius: 8,
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    fontWeight: "700",
  },
  successTag: {
    color: colors.success,
    backgroundColor: colors.successSoft,
  },
});
