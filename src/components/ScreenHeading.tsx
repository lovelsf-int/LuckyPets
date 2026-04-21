import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";

type ScreenHeadingProps = {
  eyebrow: string;
  title: string;
};

export function ScreenHeading({ eyebrow, title }: ScreenHeadingProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing[1],
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
});
