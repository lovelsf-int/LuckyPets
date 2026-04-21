import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { EmptyState } from "../../components/EmptyState";
import { FilterRow } from "../../components/FilterRow";
import { ScreenHeading } from "../../components/ScreenHeading";
import { SectionCard } from "../../components/SectionCard";
import { screenStyles } from "../../components/screenStyles";
import { TagList } from "../../components/TagList";
import { colors, spacing } from "../../theme";
import type { IntentFilter, OwnerPetProfile, Pet, SpeciesFilter } from "../../types";

const intentOptions: Array<[IntentFilter, string]> = [
  ["all", "全部"],
  ["social", "交友"],
  ["playdate", "玩伴"],
  ["breeding", "繁育"],
];

const speciesOptions: Array<[SpeciesFilter, string]> = [
  ["all", "全部"],
  ["dog", "狗狗"],
  ["cat", "猫咪"],
  ["rabbit", "兔兔"],
];

type MatchScreenProps = {
  profile: OwnerPetProfile;
  pet?: Pet;
  queueLength: number;
  queueIndex: number;
  intent: IntentFilter;
  species: SpeciesFilter;
  matches: Pet[];
  onSetIntent: (value: IntentFilter) => void;
  onSetSpecies: (value: SpeciesFilter) => void;
  onPass: () => void;
  onLike: () => void;
  onOpenChat: (petName: string) => void;
};

export function MatchScreen({
  profile,
  pet,
  queueLength,
  queueIndex,
  intent,
  species,
  matches,
  onSetIntent,
  onSetSpecies,
  onPass,
  onLike,
  onOpenChat,
}: MatchScreenProps) {
  return (
    <ScrollView contentContainerStyle={screenStyles.scrollContent}>
      <ScreenHeading
        eyebrow="今日推荐"
        title={intent === "breeding" ? "已开启繁育准入筛选" : `适合${profile.name}的新朋友`}
      />

      <FilterRow value={intent} options={intentOptions} onChange={onSetIntent} />
      <FilterRow value={species} options={speciesOptions} onChange={onSetSpecies} />

      {pet ? <PetCard pet={pet} /> : <EmptyState title="暂时没有符合条件的宠物" copy="可以放宽目的、宠物类型或城市范围。" />}

      <View style={styles.actionRow}>
        <AppButton label="跳过" variant="danger" onPress={onPass} />
        <AppButton label="喜欢" onPress={onLike} />
      </View>

      <Text style={styles.queueText}>{queueLength ? `${queueIndex + 1} / ${queueLength}` : "0 / 0"}</Text>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>新配对</Text>
        {matches.length ? (
          matches
            .slice(-3)
            .reverse()
            .map((match) => (
              <Pressable key={match.name} style={styles.matchRow} onPress={() => onOpenChat(match.name)}>
                <Image source={{ uri: match.photo }} style={styles.matchAvatar} />
                <View>
                  <Text style={styles.matchName}>{match.name}</Text>
                  <Text style={styles.matchMeta}>{match.intentLabel} · {match.score}% 契合</Text>
                </View>
              </Pressable>
            ))
        ) : (
          <Text style={screenStyles.mutedCopy}>喜欢彼此后，新的配对会出现在这里。</Text>
        )}
      </SectionCard>
    </ScrollView>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  return (
    <View style={styles.petCard}>
      <Image source={{ uri: pet.photo }} style={styles.petPhoto} />
      <View style={styles.petBody}>
        <View style={styles.petTitleRow}>
          <View>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petMeta}>{pet.city} · {pet.age}</Text>
          </View>
          <Text style={styles.score}>{pet.score}%</Text>
        </View>
        <Text style={styles.intentPill}>{pet.intentLabel}</Text>
        <Text style={styles.petBio}>{pet.bio}</Text>
        <TagList items={pet.traits} />
        <TagList items={pet.health} tone="success" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  petCard: {
    overflow: "hidden",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  petPhoto: {
    width: "100%",
    height: 390,
  },
  petBody: {
    gap: spacing[2],
    padding: spacing[3],
  },
  petTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing[2],
  },
  petName: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
  },
  petMeta: {
    color: colors.muted,
    marginTop: 4,
  },
  score: {
    overflow: "hidden",
    minWidth: 62,
    height: 42,
    borderRadius: 8,
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 42,
    textAlign: "center",
  },
  intentPill: {
    alignSelf: "flex-start",
    overflow: "hidden",
    paddingHorizontal: spacing[2],
    paddingVertical: 7,
    borderRadius: 8,
    color: colors.white,
    backgroundColor: colors.text,
    fontWeight: "800",
  },
  petBio: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  queueText: {
    color: colors.muted,
    textAlign: "center",
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  matchAvatar: {
    width: 52,
    height: 52,
    borderRadius: 8,
  },
  matchName: {
    color: colors.text,
    fontWeight: "800",
  },
  matchMeta: {
    color: colors.muted,
    marginTop: 3,
  },
});
