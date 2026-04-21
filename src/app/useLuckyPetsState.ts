import { useEffect, useState } from "react";

import { apiClient } from "../api";
import type {
  AuthRequest,
  AuthSession,
  BreedingEligibility,
  ChatMessage,
  ConversationSummary,
  ReportCategory,
  SwipeQueueMeta,
} from "../api";
import type { HealthRecord, IntentFilter, OwnerPetProfile, Pet, PetPhoto, SpeciesFilter, TabKey } from "../types";

export const defaultProfile: OwnerPetProfile = {
  id: "pet-demo-naigai",
  name: "奶盖",
  species: "dog",
  city: "上海",
  breed: "金毛",
  age: "2 岁",
  sex: "female",
  intent: "playdate",
  note: "第一次见面不脱牵引，先短时间公园同行。",
  photoCount: 3,
  healthStatus: "approved",
};

export type ProfileSaveState = "idle" | "dirty" | "saving" | "saved";
export type MessageLoadState = "idle" | "loading" | "ready";
export type EligibilityLoadState = "idle" | "loading" | "ready";
export type SafetyActionState = "idle" | "saving" | "reported" | "blocked" | "unmatched";

const defaultSwipeQueueMeta: SwipeQueueMeta = {
  totalCandidates: 0,
  skippedByHistory: 0,
};

export function useLuckyPetsState() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [tab, setTab] = useState<TabKey>("match");
  const [intent, setIntent] = useState<IntentFilter>("all");
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const [index, setIndex] = useState(0);
  const [selectedChat, setSelectedChat] = useState("");
  const [profile, setProfile] = useState<OwnerPetProfile>(defaultProfile);
  const [petProfiles, setPetProfiles] = useState<OwnerPetProfile[]>([defaultProfile]);
  const [draftProfile, setDraftProfile] = useState<OwnerPetProfile>(defaultProfile);
  const [profileSaveState, setProfileSaveState] = useState<ProfileSaveState>("idle");
  const [petPhotos, setPetPhotos] = useState<PetPhoto[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [mediaStatus, setMediaStatus] = useState<ProfileSaveState>("idle");
  const [queue, setQueue] = useState<Pet[]>([]);
  const [swipeQueueMeta, setSwipeQueueMeta] = useState<SwipeQueueMeta>(defaultSwipeQueueMeta);
  const [matchedPets, setMatchedPets] = useState<Pet[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageLoadState, setMessageLoadState] = useState<MessageLoadState>("idle");
  const [breedingEligibility, setBreedingEligibility] = useState<BreedingEligibility | null>(null);
  const [eligibilityLoadState, setEligibilityLoadState] = useState<EligibilityLoadState>("idle");
  const [safetyActionState, setSafetyActionState] = useState<SafetyActionState>("idle");
  const [safetyNotice, setSafetyNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const currentPet = queue.length ? queue[index % queue.length] : undefined;

  useEffect(() => {
    let isActive = true;

    async function loadInitialState() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const nextSession = await apiClient.getSession();
        if (!isActive) return;
        setSession(nextSession);
        if (!nextSession) return;
        const [nextProfiles, nextProfile, nextMatches] = await Promise.all([
          apiClient.listOwnerPets(),
          apiClient.getOwnerProfile(),
          apiClient.listMatches(),
        ]);
        if (!isActive) return;
        setPetProfiles(nextProfiles);
        setProfile(nextProfile);
        setDraftProfile(nextProfile);
        setMatchedPets(nextMatches);
        await Promise.all([loadPetMedia(nextProfile.id), loadConversationState(nextMatches[0]?.name)]);
      } catch {
        if (isActive) setErrorMessage("暂时无法加载账号资料，请稍后重试。");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadInitialState();
    return () => {
      isActive = false;
    };
  }, []);

  async function signIn(request: AuthRequest) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const nextSession = await apiClient.signIn(request);
      const [nextProfiles, nextProfile, nextMatches] = await Promise.all([
        apiClient.listOwnerPets(),
        apiClient.getOwnerProfile(),
        apiClient.listMatches(),
      ]);
      setSession(nextSession);
      setPetProfiles(nextProfiles);
      setProfile(nextProfile);
      setDraftProfile(nextProfile);
      setMatchedPets(nextMatches);
      await Promise.all([loadPetMedia(nextProfile.id), loadConversationState(nextMatches[0]?.name)]);
      setTab("match");
    } catch {
      setErrorMessage("登录暂时没有成功，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }

  async function createAccount(request: AuthRequest) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const nextSession = await apiClient.createAccount(request);
      setSession(nextSession);
      setConversations([]);
      setChatMessages([]);
      setMessageLoadState("ready");
      setBreedingEligibility(null);
      setEligibilityLoadState("ready");
      setTab("profile");
    } catch {
      setErrorMessage("创建账号暂时没有成功，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    await apiClient.signOut();
    setSession(null);
    setTab("match");
    setSelectedChat("");
    setSafetyActionState("idle");
    setSafetyNotice("");
    setQueue([]);
    setSwipeQueueMeta(defaultSwipeQueueMeta);
    setMatchedPets([]);
    setConversations([]);
    setChatMessages([]);
    setMessageLoadState("idle");
    setBreedingEligibility(null);
    setEligibilityLoadState("idle");
  }

  async function requestAccountDeletion(reason: string) {
    try {
      setErrorMessage("");
      await apiClient.requestAccountDeletion({ reason });
      await signOut();
    } catch {
      setErrorMessage("账号删除请求暂时没有提交成功，请稍后重试。");
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadQueue() {
      try {
        setErrorMessage("");
        const nextQueue = await apiClient.listSwipeQueue({ intent, species });
        if (!isActive) return;
        setQueue(nextQueue.pets);
        setSwipeQueueMeta({
          totalCandidates: nextQueue.totalCandidates,
          skippedByHistory: nextQueue.skippedByHistory,
          emptyReason: nextQueue.emptyReason,
        });
        setIndex(0);
      } catch {
        if (isActive) {
          setSwipeQueueMeta(defaultSwipeQueueMeta);
          setErrorMessage("暂时无法加载推荐队列，请稍后重试。");
        }
      }
    }

    loadQueue();
    return () => {
      isActive = false;
    };
  }, [intent, species]);

  function setIntentFilter(value: IntentFilter) {
    setIntent(value);
    setIndex(0);
  }

  function setSpeciesFilter(value: SpeciesFilter) {
    setSpecies(value);
    setIndex(0);
  }

  function removePetFromQueue(petName: string) {
    const wasQueued = queue.some((pet) => pet.name === petName);
    const nextQueueLength = queue.filter((pet) => pet.name !== petName).length;
    setQueue((value) => value.filter((pet) => pet.name !== petName));
    setIndex(0);

    if (!wasQueued) return;

    setSwipeQueueMeta((value) => {
      const nextSkippedByHistory = Math.min(value.totalCandidates, value.skippedByHistory + 1);
      return {
        ...value,
        skippedByHistory: nextSkippedByHistory,
        emptyReason: nextQueueLength ? undefined : value.totalCandidates ? "all_seen" : value.emptyReason,
      };
    });
  }

  function moveNext() {
    if (!currentPet || !queue.length) return;
    const skippedPet = currentPet;
    removePetFromQueue(skippedPet.name);
    apiClient.passPet(skippedPet.name).catch(() => {
      setErrorMessage("跳过操作暂时没有同步成功，请稍后重试。");
    });
  }

  function likeCurrentPet() {
    if (!currentPet || !queue.length) return;
    const likedPet = currentPet;
    setMatchedPets((value) => (value.some((pet) => pet.name === likedPet.name) ? value : [...value, likedPet]));
    setSelectedChat(likedPet.name);
    setSafetyActionState("idle");
    setSafetyNotice("");
    removePetFromQueue(likedPet.name);
    apiClient
      .likePet(likedPet.name)
      .then((nextMatches) => {
        setMatchedPets(nextMatches);
        return loadConversationState(likedPet.name);
      })
      .catch(() => {
        setErrorMessage("喜欢操作暂时没有同步成功，请稍后重试。");
      });
  }

  function openChat(petName: string) {
    setSelectedChat(petName);
    setSafetyActionState("idle");
    setSafetyNotice("");
    setTab("messages");
    void loadConversationState(petName);
  }

  function selectChat(petName: string) {
    setSelectedChat(petName);
    setSafetyActionState("idle");
    setSafetyNotice("");
    void loadMessagesForPet(petName);
  }

  function changeTab(nextTab: TabKey) {
    setTab(nextTab);
    if (nextTab === "messages") {
      void loadConversationState(selectedChat);
    }
  }

  function getActiveChatPetName() {
    return selectedChat || matchedPets[0]?.name || "";
  }

  async function loadConversationState(preferredPetName = selectedChat) {
    try {
      setMessageLoadState("loading");
      const nextConversations = await apiClient.listConversations();
      const activeConversation =
        nextConversations.find((conversation) => conversation.pet.name === preferredPetName) || nextConversations[0];

      setConversations(nextConversations);
      setSelectedChat(activeConversation?.pet.name || "");

      if (!activeConversation) {
        setChatMessages([]);
        setBreedingEligibility(null);
        setEligibilityLoadState("ready");
        setMessageLoadState("ready");
        return;
      }

      const nextMessages = await apiClient.listMessages(activeConversation.id);
      setChatMessages(nextMessages);
      await loadBreedingEligibility(activeConversation);
      setMessageLoadState("ready");
    } catch {
      setMessageLoadState("idle");
      setErrorMessage("消息暂时无法加载，请稍后重试。");
    }
  }

  async function loadMessagesForPet(petName: string) {
    const conversation = conversations.find((item) => item.pet.name === petName);
    if (!conversation) {
      await loadConversationState(petName);
      return;
    }

    try {
      setMessageLoadState("loading");
      setChatMessages([]);
      const nextMessages = await apiClient.listMessages(conversation.id);
      setChatMessages(nextMessages);
      await loadBreedingEligibility(conversation);
      setMessageLoadState("ready");
    } catch {
      setMessageLoadState("idle");
      setErrorMessage("消息暂时无法加载，请稍后重试。");
    }
  }

  async function loadBreedingEligibility(conversation: ConversationSummary) {
    if (conversation.pet.intent !== "breeding" && conversation.safetyState !== "breeding_review_required") {
      setBreedingEligibility(null);
      setEligibilityLoadState("ready");
      return;
    }

    try {
      setEligibilityLoadState("loading");
      const nextEligibility = await apiClient.getBreedingEligibility(conversation.pet.name);
      setBreedingEligibility(nextEligibility);
      setEligibilityLoadState("ready");
    } catch {
      setBreedingEligibility(null);
      setEligibilityLoadState("idle");
      setErrorMessage("繁育资格状态暂时无法加载，请稍后重试。");
    }
  }

  async function reportSelectedChat(category: ReportCategory = "harassment") {
    const petName = getActiveChatPetName();
    if (!petName) return;

    try {
      setSafetyActionState("saving");
      setErrorMessage("");
      await apiClient.report({
        targetType: "conversation",
        targetId: `conversation-${petName}`,
        category,
        details: `移动端快捷举报：${petName} 的会话需要审核。`,
      });
      setSafetyActionState("reported");
      setSafetyNotice("举报已提交，审核前建议先暂停线下见面。");
    } catch {
      setSafetyActionState("idle");
      setErrorMessage("举报暂时没有提交成功，请稍后重试。");
    }
  }

  async function blockSelectedChat() {
    const petName = getActiveChatPetName();
    if (!petName) return;

    try {
      setSafetyActionState("saving");
      setErrorMessage("");
      await apiClient.blockOwner(petName);
      const nextMatches = await apiClient.listMatches();
      setMatchedPets(nextMatches);
      setSafetyActionState("blocked");
      setSafetyNotice("已拉黑，对方不会再次进入推荐或会话。");
      await loadConversationState("");
    } catch {
      setSafetyActionState("idle");
      setErrorMessage("拉黑暂时没有成功，请稍后重试。");
    }
  }

  async function unmatchSelectedChat() {
    const petName = getActiveChatPetName();
    if (!petName) return;

    try {
      setSafetyActionState("saving");
      setErrorMessage("");
      await apiClient.unmatch(petName);
      const nextMatches = await apiClient.listMatches();
      setMatchedPets(nextMatches);
      setSafetyActionState("unmatched");
      setSafetyNotice("已解除匹配，这段会话不会继续展示。");
      await loadConversationState("");
    } catch {
      setSafetyActionState("idle");
      setErrorMessage("解除匹配暂时没有成功，请稍后重试。");
    }
  }

  function updateProfile(nextProfile: OwnerPetProfile) {
    setDraftProfile(nextProfile);
    setProfileSaveState("dirty");
  }

  function selectPetProfile(petId: string) {
    const nextProfile = petProfiles.find((pet) => pet.id === petId);
    if (!nextProfile) return;
    setProfile(nextProfile);
    setDraftProfile(nextProfile);
    setProfileSaveState("idle");
    void loadPetMedia(petId);
    apiClient.setActivePet(petId).then(setSession).catch(() => {
      setErrorMessage("当前宠物切换暂时没有同步成功，请稍后重试。");
    });
  }

  function startNewPetProfile() {
    setDraftProfile({
      id: "",
      name: "新朋友",
      species: "dog",
      city: profile.city,
      breed: "",
      age: "",
      sex: "unknown",
      intent: "social",
      note: "先从线上交流开始，确认边界后再安排见面。",
      photoCount: 0,
      healthStatus: "not_started",
    });
    setPetPhotos([]);
    setHealthRecords([]);
    setProfileSaveState("dirty");
  }

  async function loadPetMedia(petId: string) {
    if (!petId) {
      setPetPhotos([]);
      setHealthRecords([]);
      return;
    }

    try {
      setMediaStatus("saving");
      const [nextPhotos, nextRecords] = await Promise.all([
        apiClient.listPetPhotos(petId),
        apiClient.listHealthRecords(petId),
      ]);
      setPetPhotos(nextPhotos);
      setHealthRecords(nextRecords);
      setMediaStatus("idle");
    } catch {
      setMediaStatus("dirty");
      setErrorMessage("照片或健康记录暂时无法加载，请稍后重试。");
    }
  }

  async function saveDraftProfile() {
    try {
      setProfileSaveState("saving");
      setErrorMessage("");
      const savedProfile = draftProfile.id
        ? await apiClient.updateOwnerPet(draftProfile)
        : await apiClient.createOwnerPet({
            name: draftProfile.name,
            species: draftProfile.species,
            city: draftProfile.city,
            breed: draftProfile.breed,
            age: draftProfile.age,
            sex: draftProfile.sex,
            intent: draftProfile.intent,
            note: draftProfile.note,
            photoCount: draftProfile.photoCount,
            healthStatus: draftProfile.healthStatus,
          });
      const nextProfiles = await apiClient.listOwnerPets();
      setPetProfiles(nextProfiles);
      setProfile(savedProfile);
      setDraftProfile(savedProfile);
      setProfileSaveState("saved");
      await loadPetMedia(savedProfile.id);
      const nextSession = await apiClient.setActivePet(savedProfile.id);
      setSession(nextSession);
    } catch {
      setProfileSaveState("dirty");
      setErrorMessage("资料暂时没有保存成功，请稍后重试。");
    }
  }

  async function deleteDraftProfile() {
    if (!draftProfile.id) {
      setDraftProfile(profile);
      setProfileSaveState("idle");
      return;
    }

    try {
      setErrorMessage("");
      const nextProfiles = await apiClient.deleteOwnerPet(draftProfile.id);
      const nextProfile = nextProfiles[0] || profile;
      setPetProfiles(nextProfiles);
      setProfile(nextProfile);
      setDraftProfile(nextProfile);
      await loadPetMedia(nextProfile.id);
      setProfileSaveState("idle");
      const nextSession = await apiClient.setActivePet(nextProfile.id);
      setSession(nextSession);
    } catch {
      setErrorMessage("宠物资料暂时没有删除成功，请稍后重试。");
    }
  }

  async function addMockPetPhoto() {
    if (!draftProfile.id) {
      await saveDraftProfile();
      return;
    }

    try {
      setMediaStatus("saving");
      setErrorMessage("");
      const nextPhotos = await apiClient.addPetPhoto(draftProfile.id, {
        uri: `mock://${draftProfile.id}/photo-${petPhotos.length + 1}`,
        caption: `新增照片 ${petPhotos.length + 1}`,
      });
      const nextProfiles = await apiClient.listOwnerPets();
      const nextProfile = nextProfiles.find((pet) => pet.id === draftProfile.id) || draftProfile;
      setPetPhotos(nextPhotos);
      setPetProfiles(nextProfiles);
      setProfile(nextProfile);
      setDraftProfile(nextProfile);
      setMediaStatus("saved");
    } catch {
      setMediaStatus("dirty");
      setErrorMessage("照片暂时没有添加成功，请稍后重试。");
    }
  }

  async function addMockHealthRecord() {
    if (!draftProfile.id) {
      await saveDraftProfile();
      return;
    }

    try {
      setMediaStatus("saving");
      setErrorMessage("");
      const today = new Date().toISOString().slice(0, 10);
      const nextRecords = await apiClient.addHealthRecord(draftProfile.id, {
        type: draftProfile.intent === "breeding" ? "genetic_screening" : "vaccination",
        title: draftProfile.intent === "breeding" ? "基因筛查材料" : "疫苗记录",
        issuedAt: today,
        note: "由移动端 mock 入口创建，后续接真实文件上传和审核。",
      });
      const nextProfiles = await apiClient.listOwnerPets();
      const nextProfile = nextProfiles.find((pet) => pet.id === draftProfile.id) || draftProfile;
      setHealthRecords(nextRecords);
      setPetProfiles(nextProfiles);
      setProfile(nextProfile);
      setDraftProfile(nextProfile);
      setMediaStatus("saved");
    } catch {
      setMediaStatus("dirty");
      setErrorMessage("健康记录暂时没有添加成功，请稍后重试。");
    }
  }

  return {
    session,
    tab,
    setTab: changeTab,
    intent,
    setIntentFilter,
    species,
    setSpeciesFilter,
    index,
    queue,
    swipeQueueMeta,
    currentPet,
    matchedPets,
    conversations,
    chatMessages,
    messageLoadState,
    breedingEligibility,
    eligibilityLoadState,
    selectedChat,
    selectChat,
    safetyActionState,
    safetyNotice,
    profile,
    petProfiles,
    draftProfile,
    profileSaveState,
    petPhotos,
    healthRecords,
    mediaStatus,
    updateProfile,
    selectPetProfile,
    startNewPetProfile,
    saveDraftProfile,
    deleteDraftProfile,
    addMockPetPhoto,
    addMockHealthRecord,
    isLoading,
    errorMessage,
    signIn,
    createAccount,
    signOut,
    requestAccountDeletion,
    moveNext,
    likeCurrentPet,
    openChat,
    reportSelectedChat,
    blockSelectedChat,
    unmatchSelectedChat,
  };
}
