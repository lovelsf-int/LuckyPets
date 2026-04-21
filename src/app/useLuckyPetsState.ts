import { useMemo, useState } from "react";

import { pets } from "../data/pets";
import type { IntentFilter, OwnerPetProfile, Pet, SpeciesFilter, TabKey } from "../types";

export const defaultProfile: OwnerPetProfile = {
  name: "奶盖",
  city: "上海",
  breed: "金毛",
  age: "2 岁",
  note: "第一次见面不脱牵引，先短时间公园同行。",
};

export function useLuckyPetsState() {
  const [tab, setTab] = useState<TabKey>("match");
  const [intent, setIntent] = useState<IntentFilter>("all");
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState("");
  const [profile, setProfile] = useState<OwnerPetProfile>(defaultProfile);

  const queue = useMemo(
    () =>
      pets.filter((pet) => {
        const intentMatch = intent === "all" || pet.intent === intent;
        const speciesMatch = species === "all" || pet.species === species;
        return intentMatch && speciesMatch;
      }),
    [intent, species],
  );

  const currentPet = queue.length ? queue[index % queue.length] : undefined;
  const matchedPets = matches.map((name) => pets.find((pet) => pet.name === name)).filter(Boolean) as Pet[];

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
    setIndex((value) => (value + 1) % queue.length);
  }

  function likeCurrentPet() {
    if (!currentPet || !queue.length) return;
    setMatches((value) => (value.includes(currentPet.name) ? value : [...value, currentPet.name]));
    setSelectedChat(currentPet.name);
    setIndex((value) => (value + 1) % queue.length);
  }

  function openChat(petName: string) {
    setSelectedChat(petName);
    setTab("messages");
  }

  return {
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
    setProfile,
    moveNext,
    likeCurrentPet,
    openChat,
  };
}
