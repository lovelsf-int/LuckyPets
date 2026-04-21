import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../theme";

type AppButtonProps = {
  label: string;
  variant?: "primary" | "danger" | "quiet";
  onPress: () => void;
};

export function AppButton({ label, variant = "primary", onPress }: AppButtonProps) {
  const buttonStyle = {
    primary: styles.primary,
    danger: styles.danger,
    quiet: styles.quiet,
  }[variant];
  const labelStyle = {
    primary: styles.primaryLabel,
    danger: styles.dangerLabel,
    quiet: styles.quietLabel,
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.button, buttonStyle]}
      onPress={onPress}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
  },
  primary: {
    borderColor: colors.accentBorder,
    backgroundColor: colors.accentSoft,
  },
  danger: {
    borderColor: colors.dangerSoft,
    backgroundColor: colors.dangerBg,
  },
  quiet: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: {
    fontWeight: "800",
  },
  primaryLabel: {
    color: colors.accent,
  },
  dangerLabel: {
    color: colors.danger,
  },
  quietLabel: {
    color: colors.text,
  },
});
