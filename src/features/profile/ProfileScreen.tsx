import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { ScreenHeading } from "../../components/ScreenHeading";
import { SectionCard } from "../../components/SectionCard";
import { screenStyles } from "../../components/screenStyles";
import { colors, spacing } from "../../theme";
import type { OwnerPetProfile } from "../../types";
import type { AuthSession } from "../../api";

const profileFields: Array<[keyof OwnerPetProfile, string, boolean]> = [
  ["name", "宠物昵称", false],
  ["city", "城市区域", false],
  ["breed", "品种", false],
  ["age", "年龄", false],
  ["note", "见面边界", true],
];

type ProfileScreenProps = {
  session: AuthSession;
  profile: OwnerPetProfile;
  errorMessage: string;
  onChangeProfile: (profile: OwnerPetProfile) => void;
  onSignOut: () => void;
  onRequestAccountDeletion: (reason: string) => void;
};

export function ProfileScreen({
  session,
  profile,
  errorMessage,
  onChangeProfile,
  onSignOut,
  onRequestAccountDeletion,
}: ProfileScreenProps) {
  return (
    <ScrollView contentContainerStyle={screenStyles.scrollContent}>
      <ScreenHeading eyebrow="我的宠物" title="资料越清楚，匹配越安全。" />
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>账号</Text>
        <Text style={screenStyles.mutedCopy}>{session.displayName} · {session.userId}</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <View style={styles.actionRow}>
          <AppButton label="退出登录" variant="quiet" onPress={onSignOut} />
          <AppButton
            label="请求删除账号"
            variant="danger"
            onPress={() => onRequestAccountDeletion("用户从我的宠物页发起账号删除请求")}
          />
        </View>
      </SectionCard>
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
  errorText: {
    color: colors.danger,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
});
