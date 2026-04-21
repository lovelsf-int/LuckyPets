import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthScreen } from "../features/auth/AuthScreen";
import { MatchScreen } from "../features/matching/MatchScreen";
import { MessagesScreen } from "../features/messages/MessagesScreen";
import { ProfileScreen } from "../features/profile/ProfileScreen";
import { colors, spacing } from "../theme";
import type { TabKey } from "../types";
import { useLuckyPetsState } from "./useLuckyPetsState";

const tabs: Array<[TabKey, string]> = [
  ["match", "匹配"],
  ["messages", "消息"],
  ["profile", "我的宠物"],
];

export function LuckyPetsApp() {
  const state = useLuckyPetsState();

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
        {state.session
          ? tabs.map(([key, label]) => (
              <Pressable
                key={key}
                accessibilityRole="tab"
                accessibilityState={{ selected: state.tab === key }}
                style={[styles.tabButton, state.tab === key && styles.tabButtonActive]}
                onPress={() => state.setTab(key)}
              >
                <Text style={[styles.tabText, state.tab === key && styles.tabTextActive]}>{label}</Text>
              </Pressable>
            ))
          : null}
      </View>

      {!state.session ? (
        <AuthScreen
          isLoading={state.isLoading}
          errorMessage={state.errorMessage}
          onSignIn={state.signIn}
          onCreateAccount={state.createAccount}
        />
      ) : state.tab === "messages" ? (
        <MessagesScreen
          matches={state.matchedPets}
          selectedChat={state.selectedChat}
          profileNote={state.profile.note}
          safetyActionState={state.safetyActionState}
          safetyNotice={state.safetyNotice}
          onSelectChat={state.selectChat}
          onFindMatches={() => state.setTab("match")}
          onReport={state.reportSelectedChat}
          onBlock={state.blockSelectedChat}
          onUnmatch={state.unmatchSelectedChat}
        />
      ) : state.tab === "profile" ? (
        <ProfileScreen
          session={state.session}
          activePetId={state.profile.id}
          petProfiles={state.petProfiles}
          draftProfile={state.draftProfile}
          saveState={state.profileSaveState}
          mediaStatus={state.mediaStatus}
          petPhotos={state.petPhotos}
          healthRecords={state.healthRecords}
          errorMessage={state.errorMessage}
          onChangeProfile={state.updateProfile}
          onSelectPet={state.selectPetProfile}
          onStartNewPet={state.startNewPetProfile}
          onSaveProfile={state.saveDraftProfile}
          onDeleteProfile={state.deleteDraftProfile}
          onAddPhoto={state.addMockPetPhoto}
          onAddHealthRecord={state.addMockHealthRecord}
          onSignOut={state.signOut}
          onRequestAccountDeletion={state.requestAccountDeletion}
        />
      ) : (
        <MatchScreen
          profile={state.profile}
          pet={state.currentPet}
          queueLength={state.queue.length}
          queueIndex={state.index}
          queueMeta={state.swipeQueueMeta}
          intent={state.intent}
          species={state.species}
          matches={state.matchedPets}
          isLoading={state.isLoading}
          errorMessage={state.errorMessage}
          onSetIntent={state.setIntentFilter}
          onSetSpecies={state.setSpeciesFilter}
          onPass={state.moveNext}
          onLike={state.likeCurrentPet}
          onOpenChat={state.openChat}
        />
      )}
    </SafeAreaView>
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
});
