import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors, spacing } from "../theme";

type FilterOption<T extends string> = [T, string];

type FilterRowProps<T extends string> = {
  value: T;
  options: Array<FilterOption<T>>;
  onChange: (value: T) => void;
};

export function FilterRow<T extends string>({ value, options, onChange }: FilterRowProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map(([key, label]) => (
        <Pressable
          key={key}
          accessibilityRole="button"
          accessibilityState={{ selected: value === key }}
          style={[styles.chip, value === key && styles.chipActive]}
          onPress={() => onChange(key)}
        >
          <Text style={[styles.text, value === key && styles.textActive]}>{label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing[1],
  },
  chip: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: spacing[2],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  text: {
    color: colors.text,
    fontWeight: "700",
  },
  textActive: {
    color: colors.white,
  },
});
