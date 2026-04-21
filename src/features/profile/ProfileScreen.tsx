import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { FilterRow } from "../../components/FilterRow";
import { ScreenHeading } from "../../components/ScreenHeading";
import { SectionCard } from "../../components/SectionCard";
import { screenStyles } from "../../components/screenStyles";
import { colors, spacing } from "../../theme";
import type { AuthSession } from "../../api";
import type { MatchIntent, OwnerPetProfile, PetSex, SpeciesFilter } from "../../types";
import type { ProfileSaveState } from "../../app/useLuckyPetsState";

const textFields: Array<[keyof Pick<OwnerPetProfile, "name" | "city" | "breed" | "age" | "note">, string, boolean]> = [
  ["name", "宠物昵称", false],
  ["city", "城市区域", false],
  ["breed", "品种", false],
  ["age", "年龄", false],
  ["note", "见面边界", true],
];

const speciesOptions: Array<[Exclude<SpeciesFilter, "all">, string]> = [
  ["dog", "狗狗"],
  ["cat", "猫咪"],
  ["rabbit", "兔兔"],
];

const intentOptions: Array<[MatchIntent, string]> = [
  ["social", "交友"],
  ["playdate", "玩伴"],
  ["breeding", "繁育"],
];

const sexOptions: Array<[PetSex, string]> = [
  ["female", "妹妹"],
  ["male", "弟弟"],
  ["unknown", "暂不展示"],
];

const saveStateLabel: Record<ProfileSaveState, string> = {
  idle: "资料已同步",
  dirty: "有未保存修改",
  saving: "正在保存",
  saved: "已保存",
};

const healthStatusLabel: Record<OwnerPetProfile["healthStatus"], string> = {
  not_started: "未开始",
  pending: "审核中",
  approved: "已通过",
  needs_more_info: "需补充",
};

type ProfileScreenProps = {
  session: AuthSession;
  activePetId: string;
  petProfiles: OwnerPetProfile[];
  draftProfile: OwnerPetProfile;
  saveState: ProfileSaveState;
  errorMessage: string;
  onChangeProfile: (profile: OwnerPetProfile) => void;
  onSelectPet: (petId: string) => void;
  onStartNewPet: () => void;
  onSaveProfile: () => void;
  onDeleteProfile: () => void;
  onSignOut: () => void;
  onRequestAccountDeletion: (reason: string) => void;
};

export function ProfileScreen({
  session,
  activePetId,
  petProfiles,
  draftProfile,
  saveState,
  errorMessage,
  onChangeProfile,
  onSelectPet,
  onStartNewPet,
  onSaveProfile,
  onDeleteProfile,
  onSignOut,
  onRequestAccountDeletion,
}: ProfileScreenProps) {
  function updateDraft(partial: Partial<OwnerPetProfile>) {
    onChangeProfile({ ...draftProfile, ...partial });
  }

  function updateTextField(key: (typeof textFields)[number][0], value: string) {
    onChangeProfile({ ...draftProfile, [key]: value });
  }

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

      <SectionCard>
        <View style={styles.sectionHeader}>
          <Text style={screenStyles.sectionTitle}>宠物资料</Text>
          <Text style={styles.saveState}>{saveStateLabel[saveState]}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petTabs}>
          {petProfiles.map((profile) => (
            <Pressable
              key={profile.id}
              accessibilityRole="button"
              accessibilityState={{ selected: profile.id === activePetId }}
              style={[styles.petTab, profile.id === activePetId && styles.petTabActive]}
              onPress={() => onSelectPet(profile.id)}
            >
              <Text style={styles.petTabName}>{profile.name}</Text>
              <Text style={styles.petTabMeta}>{profile.breed || "未填写品种"} · {profile.city}</Text>
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" style={styles.petTab} onPress={onStartNewPet}>
            <Text style={styles.petTabName}>+ 新建</Text>
            <Text style={styles.petTabMeta}>添加另一只宠物</Text>
          </Pressable>
        </ScrollView>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>{draftProfile.id ? "编辑资料" : "新建资料"}</Text>
        {textFields.map(([key, label, multiline]) => (
          <View key={key} style={styles.field}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
              style={[styles.input, multiline && styles.noteInput]}
              value={draftProfile[key]}
              multiline={multiline}
              onChangeText={(value) => updateTextField(key, value)}
            />
          </View>
        ))}

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>宠物类型</Text>
          <FilterRow value={draftProfile.species} options={speciesOptions} onChange={(species) => updateDraft({ species })} />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>主要目的</Text>
          <FilterRow value={draftProfile.intent} options={intentOptions} onChange={(intent) => updateDraft({ intent })} />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>性别展示</Text>
          <FilterRow value={draftProfile.sex} options={sexOptions} onChange={(sex) => updateDraft({ sex })} />
        </View>

        <View style={styles.actionRow}>
          <AppButton label={saveState === "saving" ? "保存中" : "保存资料"} onPress={onSaveProfile} />
          <AppButton label={draftProfile.id ? "删除资料" : "放弃新建"} variant="danger" onPress={onDeleteProfile} />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>照片与健康记录</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{draftProfile.photoCount}</Text>
            <Text style={styles.statusLabel}>照片</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{healthStatusLabel[draftProfile.healthStatus]}</Text>
            <Text style={styles.statusLabel}>健康记录</Text>
          </View>
        </View>
        <Text style={screenStyles.mutedCopy}>
          下一步会接照片上传、疫苗记录、驱虫记录和繁育资格材料。医疗文件默认私密，只在家长明确授权后分享。
        </Text>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>繁育准入</Text>
        <Text style={screenStyles.mutedCopy}>疫苗记录、年龄、体况、基因筛查和家长身份都需要核验后才能开启繁育聊天。</Text>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[2],
  },
  saveState: {
    color: colors.muted,
    fontWeight: "700",
  },
  petTabs: {
    gap: spacing[1],
  },
  petTab: {
    minWidth: 138,
    gap: 4,
    padding: spacing[2],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  petTabActive: {
    borderColor: colors.accentBorder,
    backgroundColor: colors.accentSoft,
  },
  petTabName: {
    color: colors.text,
    fontWeight: "800",
  },
  petTabMeta: {
    color: colors.muted,
    fontSize: 13,
  },
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
  statusGrid: {
    flexDirection: "row",
    gap: spacing[2],
  },
  statusItem: {
    flex: 1,
    gap: 4,
    padding: spacing[2],
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  statusValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  statusLabel: {
    color: colors.muted,
  },
});
