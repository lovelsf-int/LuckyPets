import { StyleSheet } from "react-native";

import { colors, spacing } from "../theme";

export const screenStyles = StyleSheet.create({
  scrollContent: {
    gap: spacing[2],
    padding: spacing[3],
    paddingBottom: spacing[6],
  },
  fullPanel: {
    gap: spacing[2],
    padding: spacing[3],
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  mutedCopy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
});
