import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { ScreenHeading } from "../../components/ScreenHeading";
import { SectionCard } from "../../components/SectionCard";
import { screenStyles } from "../../components/screenStyles";
import { colors, spacing } from "../../theme";
import type { BreedingEligibility, ChatMessage, ConversationSummary, ReviewStatus } from "../../api";

type MessageLoadState = "idle" | "loading" | "ready";
type EligibilityLoadState = "idle" | "loading" | "ready";
type SafetyActionState = "idle" | "saving" | "reported" | "blocked" | "unmatched";

type MessagesScreenProps = {
  conversations: ConversationSummary[];
  messages: ChatMessage[];
  messageLoadState: MessageLoadState;
  breedingEligibility: BreedingEligibility | null;
  eligibilityLoadState: EligibilityLoadState;
  selectedChat: string;
  safetyActionState: SafetyActionState;
  safetyNotice: string;
  onSelectChat: (petName: string) => void;
  onFindMatches: () => void;
  onReport: () => void;
  onBlock: () => void;
  onUnmatch: () => void;
};

export function MessagesScreen({
  conversations,
  messages,
  messageLoadState,
  breedingEligibility,
  eligibilityLoadState,
  selectedChat,
  safetyActionState,
  safetyNotice,
  onSelectChat,
  onFindMatches,
  onReport,
  onBlock,
  onUnmatch,
}: MessagesScreenProps) {
  const activeConversation =
    conversations.find((conversation) => conversation.pet.name === selectedChat) || conversations[0];
  const activePet = activeConversation?.pet;
  const isSafetySaving = safetyActionState === "saving";
  const isMessageLoading = messageLoadState === "loading";
  const shouldShowBreedingGate =
    activeConversation?.safetyState === "breeding_review_required" || activePet?.intent === "breeding";

  if (!activePet) {
    return (
      <View style={screenStyles.fullPanel}>
        <ScreenHeading
          eyebrow="消息"
          title={safetyNotice ? "会话已处理" : isMessageLoading ? "正在加载消息" : "还没有配对"}
        />
        <Text style={screenStyles.mutedCopy}>
          {safetyNotice || (isMessageLoading ? "正在同步会话列表和最新消息。" : "先去喜欢几个合适的新朋友，再回来开始聊天。")}
        </Text>
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
        {conversations.map((conversation) => (
          <Pressable
            key={conversation.id}
            accessibilityRole="button"
            accessibilityState={{ selected: activePet.name === conversation.pet.name }}
            style={[styles.chatChip, activePet.name === conversation.pet.name && styles.chatChipActive]}
            onPress={() => onSelectChat(conversation.pet.name)}
          >
            <Image source={{ uri: conversation.pet.photo }} style={styles.chatAvatar} />
            <View>
              <Text style={styles.chatChipText}>{conversation.pet.name}</Text>
              <Text style={styles.chatChipMeta}>{getSafetyLabel(conversation.safetyState)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <SectionCard style={styles.chatPanel}>
        {isMessageLoading ? (
          <Text style={styles.messageSystem}>正在同步最新消息。</Text>
        ) : messages.length ? (
          messages.map((message) => (
            <Text key={message.id} style={getMessageStyle(message.sender)}>
              {message.body}
            </Text>
          ))
        ) : (
          <Text style={styles.messageSystem}>还没有消息，先确认彼此的照护边界。</Text>
        )}
      </SectionCard>

      {shouldShowBreedingGate ? (
        <BreedingGate eligibility={breedingEligibility} loadState={eligibilityLoadState} />
      ) : null}

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

function BreedingGate({
  eligibility,
  loadState,
}: {
  eligibility: BreedingEligibility | null;
  loadState: EligibilityLoadState;
}) {
  const isApproved = eligibility?.status === "approved";
  const statusText = eligibility
    ? getEligibilityLabel(eligibility.status)
    : loadState === "loading"
      ? "正在确认"
      : "待审核";

  return (
    <SectionCard>
      <View style={styles.gateHeader}>
        <Text style={screenStyles.sectionTitle}>繁育准入</Text>
        <Text style={[styles.statusPill, isApproved ? styles.statusApproved : styles.statusPending]}>{statusText}</Text>
      </View>
      <Text style={screenStyles.mutedCopy}>
        {isApproved
          ? "资格审核已通过，仍建议在见面前再次确认兽医记录、照护计划和当地规则。"
          : "审核通过前，请只讨论照护边界和资料补齐，不推进配种安排、价格或线下交接。"}
      </Text>
      {loadState === "loading" ? <Text style={styles.checkItem}>正在同步审核材料清单。</Text> : null}
      {eligibility?.requiredEvidence.length ? (
        <View style={styles.checkList}>
          {eligibility.requiredEvidence.map((item) => (
            <Text key={item} style={styles.checkItem}>
              {isApproved ? "已确认" : "待提交"} · {item}
            </Text>
          ))}
        </View>
      ) : null}
      {eligibility?.reviewerNote ? <Text style={styles.reviewerNote}>{eligibility.reviewerNote}</Text> : null}
    </SectionCard>
  );
}

function getSafetyLabel(safetyState: ConversationSummary["safetyState"]) {
  if (safetyState === "breeding_review_required") return "繁育待审核";
  if (safetyState === "blocked") return "已拉黑";
  return "可沟通";
}

function getEligibilityLabel(status: ReviewStatus) {
  if (status === "approved") return "已通过";
  if (status === "rejected") return "未通过";
  if (status === "expired") return "已过期";
  if (status === "not_required") return "无需审核";
  return "待审核";
}

function getMessageStyle(sender: ChatMessage["sender"]) {
  if (sender === "owner") return styles.messageOutbound;
  if (sender === "system") return styles.messageSystem;
  return styles.messageInbound;
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
  chatChipMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
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
  gateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[2],
  },
  statusPill: {
    overflow: "hidden",
    minWidth: 68,
    paddingHorizontal: spacing[2],
    paddingVertical: 7,
    borderRadius: 8,
    fontWeight: "800",
    textAlign: "center",
  },
  statusPending: {
    color: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  statusApproved: {
    color: colors.success,
    backgroundColor: colors.successSoft,
  },
  checkList: {
    gap: spacing[1],
  },
  checkItem: {
    color: colors.text,
    lineHeight: 22,
  },
  reviewerNote: {
    padding: spacing[2],
    borderRadius: 8,
    color: colors.muted,
    backgroundColor: colors.background,
    lineHeight: 22,
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
