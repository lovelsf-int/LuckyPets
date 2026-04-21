import { useEffect, useState } from "react";

import { apiClient } from "../api";
import type { AuthRequest, AuthSession } from "../api";
import type { IntentFilter, OwnerPetProfile, Pet, SpeciesFilter, TabKey } from "../types";

export const defaultProfile: OwnerPetProfile = {
  name: "奶盖",
  city: "上海",
  breed: "金毛",
  age: "2 岁",
  note: "第一次见面不脱牵引，先短时间公园同行。",
};

export function useLuckyPetsState() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [tab, setTab] = useState<TabKey>("match");
  const [intent, setIntent] = useState<IntentFilter>("all");
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const [index, setIndex] = useState(0);
  const [selectedChat, setSelectedChat] = useState("");
  const [profile, setProfile] = useState<OwnerPetProfile>(defaultProfile);
  const [queue, setQueue] = useState<Pet[]>([]);
  const [matchedPets, setMatchedPets] = useState<Pet[]>([]);
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
        const [nextProfile, nextMatches] = await Promise.all([
          apiClient.getOwnerProfile(),
          apiClient.listMatches(),
        ]);
        if (!isActive) return;
        setProfile(nextProfile);
        setMatchedPets(nextMatches);
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
      const [nextProfile, nextMatches] = await Promise.all([
        apiClient.getOwnerProfile(),
        apiClient.listMatches(),
      ]);
      setSession(nextSession);
      setProfile(nextProfile);
      setMatchedPets(nextMatches);
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
    setMatchedPets([]);
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
        setQueue(nextQueue);
        setIndex(0);
      } catch {
        if (isActive) setErrorMessage("暂时无法加载推荐队列，请稍后重试。");
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

  function moveNext() {
    if (!queue.length) return;
    if (currentPet) {
      void apiClient.passPet(currentPet.name);
    }
    setIndex((value) => (value + 1) % queue.length);
  }

  function likeCurrentPet() {
    if (!currentPet || !queue.length) return;
    setMatchedPets((value) => (value.some((pet) => pet.name === currentPet.name) ? value : [...value, currentPet]));
    setSelectedChat(currentPet.name);
    setIndex((value) => (value + 1) % queue.length);
    apiClient.likePet(currentPet.name).then(setMatchedPets).catch(() => {
      setErrorMessage("喜欢操作暂时没有同步成功，请稍后重试。");
    });
  }

  function openChat(petName: string) {
    setSelectedChat(petName);
    setTab("messages");
  }

  function updateProfile(nextProfile: OwnerPetProfile) {
    setProfile(nextProfile);
    apiClient.updateOwnerProfile(nextProfile).catch(() => {
      setErrorMessage("资料暂时没有保存成功，请稍后重试。");
    });
  }

  return {
    session,
    tab,
    setTab,
    intent,
    setIntentFilter,
    species,
    setSpeciesFilter,
    index,
    queue,
    currentPet,
    matchedPets,
    selectedChat,
    setSelectedChat,
    profile,
    updateProfile,
    isLoading,
    errorMessage,
    signIn,
    createAccount,
    signOut,
    requestAccountDeletion,
    moveNext,
    likeCurrentPet,
    openChat,
  };
}
