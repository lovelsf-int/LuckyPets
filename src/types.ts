export type IntentFilter = "all" | "social" | "playdate" | "breeding";

export type SpeciesFilter = "all" | "dog" | "cat" | "rabbit";

export type TabKey = "match" | "messages" | "profile";

export type OwnerPetProfile = {
  name: string;
  city: string;
  breed: string;
  age: string;
  note: string;
};

export type Pet = {
  name: string;
  species: Exclude<SpeciesFilter, "all">;
  intent: Exclude<IntentFilter, "all">;
  intentLabel: string;
  age: string;
  city: string;
  score: number;
  photo: string;
  bio: string;
  traits: string[];
  health: string[];
  opener: string;
};
