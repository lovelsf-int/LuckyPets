import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { ScreenHeading } from "../../components/ScreenHeading";
import { SectionCard } from "../../components/SectionCard";
import { screenStyles } from "../../components/screenStyles";
import { colors, spacing } from "../../theme";
import type { Pet } from "../../types";

type SafetyActionState = "idle" | "saving" | "reported" | "blocked" | "unmatched";

type MessagesScreenProps = {
  matches: Pet[];
  selectedChat: string;
  profileNote: string;
  safetyActionState: SafetyActionState;
  safetyNotice: string;
  onSelectChat: (petName: string) => void;
  onFindMatches: () => void;
  onReport: () => void;
  onBlock: () => void;
  onUnmatch: () => void;
};

export function MessagesScreen({
  matches,
  selectedChat,
  profileNote,
  safetyActionState,
  safetyNotice,
  onSelectChat,
  onFindMatches,
  onReport,
  onBlock,
  onUnmatch,
}: MessagesScreenProps) {
  const activePet = matches.find((pet) => pet.name === selectedChat) || matches[0];
  const isSafetySaving = safetyActionState === "saving";

  if (!activePet) {
    return (
      <View style={screenStyles.fullPanel}>
        <ScreenHeading eyebrow="消息" title={safetyNotice ? "会话已处理" : "还没有配对"} />
        <Text style={screenStyles.mutedCopy}>{safetyNotice || "先去喜欢几个合适的新朋友，再回来开始聊天。"}</Text>
        <View style={styles.singleAction}>
          <AppButton label="去匹配" onPress={onFindMatches} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={screenStyles.scrollContent}>
      <ScreenHeading eyebrow="消息" title="先确认边界，再安排见面。" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chatTabs}>
        {matches.map((match) => (
          <Pressable
            key={match.name}
            accessibilityRole="button"
            accessibilityState={{ selected: activePet.name === match.name }}
            style={[styles.chatChip, activePet.name === match.name && styles.chatChipActive]}
            onPress={() => onSelectChat(match.name)}
          >
            <Image source={{ uri: match.photo }} style={styles.chatAvatar} />
            <Text style={styles.chatChipText}>{match.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <SectionCard style={styles.chatPanel}>
        <Text style={styles.messageInbound}>{activePet.opener}</Text>
        <Text style={styles.messageOutbound}>{profileNote}</Text>
        <Text style={styles.messageSystem}>见面前请确认牵引、疫苗、过敏和紧急联系人。繁育沟通需先完成认证。</Text>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>安全操作</Text>
        <Text style={screenStyles.mutedCopy}>
          遇到骚扰、虚假资料或不安全繁育邀约时，可以先举报；需要立刻停止联系时，使用拉黑或解除匹配。
        </Text>
        {safetyNotice ? <Text style={styles.safetyNotice}>{safetyNotice}</Text> : null}
        <View style={styles.safetyActions}>
          <AppButton label="举报" variant="quiet" disabled={isSafetySaving} onPress={onReport} />
          <AppButton label="解除匹配" variant="quiet" disabled={isSafetySaving} onPress={onUnmatch} />
          <AppButton label="拉黑" variant="danger" disabled={isSafetySaving} onPress={onBlock} />
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  singleAction: {
    flexDirection: "row",
  },
  chatTabs: {
    gap: spacing[1],
  },
  chatChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
    minHeight: 48,
    paddingHorizontal: spacing[1],
    paddingRight: spacing[2],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chatChipActive: {
    borderColor: colors.accentBorder,
    backgroundColor: colors.accentSoft,
  },
  chatAvatar: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  chatChipText: {
    color: colors.text,
    fontWeight: "800",
  },
  chatPanel: {
    minHeight: 380,
    justifyContent: "flex-end",
  },
  safetyNotice: {
    padding: spacing[2],
    borderRadius: 8,
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    lineHeight: 22,
  },
  safetyActions: {
    flexDirection: "row",
    gap: spacing[2],
  },
  messageInbound: {
    alignSelf: "flex-start",
    maxWidth: "82%",
    padding: spacing[2],
    borderRadius: 8,
    color: colors.text,
    backgroundColor: colors.neutral,
    lineHeight: 22,
  },
  messageOutbound: {
    alignSelf: "flex-end",
    maxWidth: "82%",
    padding: spacing[2],
    borderRadius: 8,
    color: colors.white,
    backgroundColor: colors.accent,
    lineHeight: 22,
  },
  messageSystem: {
    alignSelf: "center",
    maxWidth: "92%",
    padding: spacing[2],
    borderRadius: 8,
    color: colors.muted,
    backgroundColor: colors.background,
    lineHeight: 22,
    textAlign: "center",
  },
});
