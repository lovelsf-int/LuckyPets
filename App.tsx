import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { pets } from "./src/data/pets";
import { colors, spacing } from "./src/theme";
import type { IntentFilter, Pet, SpeciesFilter, TabKey } from "./src/types";

const defaultProfile = {
  name: "奶盖",
  city: "上海",
  breed: "金毛",
  age: "2 岁",
  note: "第一次见面不脱牵引，先短时间公园同行。",
};

export default function App() {
  const [tab, setTab] = useState<TabKey>("match");
  const [intent, setIntent] = useState<IntentFilter>("all");
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState("");
  const [profile, setProfile] = useState(defaultProfile);

  const queue = useMemo(
    () =>
      pets.filter((pet) => {
        const intentMatch = intent === "all" || pet.intent === intent;
        const speciesMatch = species === "all" || pet.species === species;
        return intentMatch && speciesMatch;
      }),
    [intent, species],
  );
  const currentPet = queue[index % Math.max(queue.length, 1)];
  const matchedPets = matches.map((name) => pets.find((pet) => pet.name === name)).filter(Boolean) as Pet[];

  function moveNext() {
    if (!queue.length) return;
    setIndex((value) => (value + 1) % queue.length);
  }

  function likeCurrentPet() {
    if (!currentPet) return;
    setMatches((value) => (value.includes(currentPet.name) ? value : [...value, currentPet.name]));
    setSelectedChat(currentPet.name);
    moveNext();
  }

  function renderTab() {
    if (tab === "messages") {
      return (
        <MessagesScreen
          matches={matchedPets}
          selectedChat={selectedChat}
          profileNote={profile.note}
          onSelectChat={setSelectedChat}
          onFindMatches={() => setTab("match")}
        />
      );
    }

    if (tab === "profile") {
      return <ProfileScreen profile={profile} onChangeProfile={setProfile} />;
    }

    return (
      <MatchScreen
        profile={profile}
        pet={currentPet}
        queueLength={queue.length}
        queueIndex={index}
        intent={intent}
        species={species}
        matches={matchedPets}
        onSetIntent={(value) => {
          setIntent(value);
          setIndex(0);
        }}
        onSetSpecies={(value) => {
          setSpecies(value);
          setIndex(0);
        }}
        onPass={moveNext}
        onLike={likeCurrentPet}
        onOpenChat={(petName) => {
          setSelectedChat(petName);
          setTab("messages");
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.brandMark}>
          <Text style={styles.brandLetters}>LP</Text>
        </View>
        <View>
          <Text style={styles.brandName}>LuckyPets</Text>
          <Text style={styles.brandSubcopy}>宠物交友与安全匹配</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {[
          ["match", "匹配"],
          ["messages", "消息"],
          ["profile", "我的宠物"],
        ].map(([key, label]) => (
          <Pressable
            key={key}
            style={[styles.tabButton, tab === key && styles.tabButtonActive]}
            onPress={() => setTab(key as TabKey)}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {renderTab()}
    </SafeAreaView>
  );
}

function MatchScreen({
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
}: {
  profile: typeof defaultProfile;
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
}) {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.eyebrow}>今日推荐</Text>
      <Text style={styles.screenTitle}>{intent === "breeding" ? "已开启繁育准入筛选" : `适合${profile.name}的新朋友`}</Text>

      <FilterRow
        value={intent}
        options={[
          ["all", "全部"],
          ["social", "交友"],
          ["playdate", "玩伴"],
          ["breeding", "繁育"],
        ]}
        onChange={(value) => onSetIntent(value as IntentFilter)}
      />
      <FilterRow
        value={species}
        options={[
          ["all", "全部"],
          ["dog", "狗狗"],
          ["cat", "猫咪"],
          ["rabbit", "兔兔"],
        ]}
        onChange={(value) => onSetSpecies(value as SpeciesFilter)}
      />

      {pet ? (
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
            <View style={styles.tags}>{pet.traits.map((trait) => <Text key={trait} style={styles.tag}>{trait}</Text>)}</View>
            <View style={styles.tags}>{pet.health.map((item) => <Text key={item} style={styles.healthTag}>{item}</Text>)}</View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>暂时没有符合条件的宠物</Text>
          <Text style={styles.emptyCopy}>可以放宽目的、宠物类型或城市范围。</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <Pressable style={[styles.actionButton, styles.passButton]} onPress={onPass}>
          <Text style={styles.passText}>跳过</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.likeButton]} onPress={onLike}>
          <Text style={styles.likeText}>喜欢</Text>
        </Pressable>
      </View>

      <Text style={styles.queueText}>{queueLength ? `${queueIndex + 1} / ${queueLength}` : "0 / 0"}</Text>

      <View style={styles.matchPanel}>
        <Text style={styles.sectionTitle}>新配对</Text>
        {matches.length ? (
          matches.slice(-3).reverse().map((match) => (
            <Pressable key={match.name} style={styles.matchRow} onPress={() => onOpenChat(match.name)}>
              <Image source={{ uri: match.photo }} style={styles.matchAvatar} />
              <View>
                <Text style={styles.matchName}>{match.name}</Text>
                <Text style={styles.matchMeta}>{match.intentLabel} · {match.score}% 契合</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={styles.mutedCopy}>喜欢彼此后，新的配对会出现在这里。</Text>
        )}
      </View>
    </ScrollView>
  );
}

function MessagesScreen({
  matches,
  selectedChat,
  profileNote,
  onSelectChat,
  onFindMatches,
}: {
  matches: Pet[];
  selectedChat: string;
  profileNote: string;
  onSelectChat: (petName: string) => void;
  onFindMatches: () => void;
}) {
  const activePet = matches.find((pet) => pet.name === selectedChat) || matches[0];

  if (!activePet) {
    return (
      <View style={styles.screen}>
        <Text style={styles.screenTitle}>还没有配对</Text>
        <Text style={styles.mutedCopy}>先去喜欢几个合适的新朋友，再回来开始聊天。</Text>
        <Pressable style={[styles.actionButton, styles.likeButton]} onPress={onFindMatches}>
          <Text style={styles.likeText}>去匹配</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.eyebrow}>消息</Text>
      <Text style={styles.screenTitle}>先确认边界，再安排见面。</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chatTabs}>
        {matches.map((match) => (
          <Pressable
            key={match.name}
            style={[styles.chatChip, activePet.name === match.name && styles.chatChipActive]}
            onPress={() => onSelectChat(match.name)}
          >
            <Image source={{ uri: match.photo }} style={styles.chatAvatar} />
            <Text style={styles.chatChipText}>{match.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.chatPanel}>
        <Text style={styles.messageInbound}>{activePet.opener}</Text>
        <Text style={styles.messageOutbound}>{profileNote}</Text>
        <Text style={styles.messageSystem}>见面前请确认牵引、疫苗、过敏和紧急联系人。繁育沟通需先完成认证。</Text>
      </View>
    </ScrollView>
  );
}

function ProfileScreen({
  profile,
  onChangeProfile,
}: {
  profile: typeof defaultProfile;
  onChangeProfile: (profile: typeof defaultProfile) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.eyebrow}>我的宠物</Text>
      <Text style={styles.screenTitle}>资料越清楚，匹配越安全。</Text>
      {[
        ["name", "宠物昵称"],
        ["city", "城市区域"],
        ["breed", "品种"],
        ["age", "年龄"],
        ["note", "见面边界"],
      ].map(([key, label]) => (
        <View key={key} style={styles.field}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <TextInput
            style={[styles.input, key === "note" && styles.noteInput]}
            value={profile[key as keyof typeof defaultProfile]}
            multiline={key === "note"}
            onChangeText={(value) => onChangeProfile({ ...profile, [key]: value })}
          />
        </View>
      ))}
      <View style={styles.safetyPanel}>
        <Text style={styles.sectionTitle}>繁育准入</Text>
        <Text style={styles.mutedCopy}>疫苗记录、年龄、体况、基因筛查和家长身份都需要核验后才能开启繁育聊天。</Text>
      </View>
    </ScrollView>
  );
}

function FilterRow({
  value,
  options,
  onChange,
}: {
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
      {options.map(([key, label]) => (
        <Pressable key={key} style={[styles.filterChip, value === key && styles.filterChipActive]} onPress={() => onChange(key)}>
          <Text style={[styles.filterText, value === key && styles.filterTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingTop: spacing[2],
    paddingBottom: spacing[1],
  },
  brandMark: {
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  brandLetters: {
    color: colors.white,
    fontWeight: "800",
  },
  brandName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  brandSubcopy: {
    color: colors.muted,
    marginTop: 2,
  },
  tabs: {
    flexDirection: "row",
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabButtonActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  tabText: {
    color: colors.text,
    fontWeight: "700",
  },
  tabTextActive: {
    color: colors.white,
  },
  screen: {
    gap: spacing[2],
    padding: spacing[3],
    paddingBottom: spacing[6],
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  screenTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  filterRow: {
    gap: spacing[1],
  },
  filterChip: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: spacing[2],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  filterText: {
    color: colors.text,
    fontWeight: "700",
  },
  filterTextActive: {
    color: colors.white,
  },
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
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[1],
  },
  tag: {
    overflow: "hidden",
    paddingHorizontal: spacing[2],
    paddingVertical: 7,
    borderRadius: 8,
    color: colors.accent,
    backgroundColor: colors.accentSoft,
    fontWeight: "700",
  },
  healthTag: {
    overflow: "hidden",
    paddingHorizontal: spacing[2],
    paddingVertical: 7,
    borderRadius: 8,
    color: colors.success,
    backgroundColor: colors.successSoft,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
  },
  passButton: {
    borderColor: colors.dangerSoft,
    backgroundColor: colors.dangerBg,
  },
  likeButton: {
    borderColor: colors.accentBorder,
    backgroundColor: colors.accentSoft,
  },
  passText: {
    color: colors.danger,
    fontWeight: "800",
  },
  likeText: {
    color: colors.accent,
    fontWeight: "800",
  },
  queueText: {
    color: colors.muted,
    textAlign: "center",
  },
  matchPanel: {
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
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
  mutedCopy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  emptyPanel: {
    gap: spacing[1],
    padding: spacing[4],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  emptyCopy: {
    color: colors.muted,
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
    gap: spacing[2],
    minHeight: 380,
    justifyContent: "flex-end",
    padding: spacing[3],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
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
  safetyPanel: {
    gap: spacing[1],
    padding: spacing[3],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
