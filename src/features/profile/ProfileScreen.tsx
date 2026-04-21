import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenHeading } from "../../components/ScreenHeading";
import { SectionCard } from "../../components/SectionCard";
import { screenStyles } from "../../components/screenStyles";
import { colors, spacing } from "../../theme";
import type { OwnerPetProfile } from "../../types";

const profileFields: Array<[keyof OwnerPetProfile, string, boolean]> = [
  ["name", "宠物昵称", false],
  ["city", "城市区域", false],
  ["breed", "品种", false],
  ["age", "年龄", false],
  ["note", "见面边界", true],
];

type ProfileScreenProps = {
  profile: OwnerPetProfile;
  onChangeProfile: (profile: OwnerPetProfile) => void;
};

export function ProfileScreen({ profile, onChangeProfile }: ProfileScreenProps) {
  return (
    <ScrollView contentContainerStyle={screenStyles.scrollContent}>
      <ScreenHeading eyebrow="我的宠物" title="资料越清楚，匹配越安全。" />
      {profileFields.map(([key, label, multiline]) => (
        <View key={key} style={styles.field}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <TextInput
            style={[styles.input, multiline && styles.noteInput]}
            value={profile[key]}
            multiline={multiline}
            onChangeText={(value) => onChangeProfile({ ...profile, [key]: value })}
          />
        </View>
      ))}
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>繁育准入</Text>
        <Text style={screenStyles.mutedCopy}>疫苗记录、年龄、体况、基因筛查和家长身份都需要核验后才能开启繁育聊天。</Text>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 7,
  },
  fieldLabel: {
    color: colors.text,
    fontWeight: "800",
  },
  input: {
    minHeight: 44,
    paddingHorizontal: spacing[2],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  noteInput: {
    minHeight: 104,
    paddingTop: spacing[2],
    textAlignVertical: "top",
  },
});
