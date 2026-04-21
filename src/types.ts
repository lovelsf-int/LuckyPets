export type IntentFilter = "all" | "social" | "playdate" | "breeding";

export type SpeciesFilter = "all" | "dog" | "cat" | "rabbit";

export type TabKey = "match" | "messages" | "profile";

export type PetSpecies = Exclude<SpeciesFilter, "all">;

export type MatchIntent = Exclude<IntentFilter, "all">;

export type PetSex = "female" | "male" | "unknown";

export type HealthReviewStatus = "not_started" | "pending" | "approved" | "needs_more_info";

export type OwnerPetProfile = {
  id: string;
  name: string;
  species: PetSpecies;
  city: string;
  breed: string;
  age: string;
  sex: PetSex;
  intent: MatchIntent;
  note: string;
  photoCount: number;
  healthStatus: HealthReviewStatus;
};

export type Pet = {
  name: string;
  species: PetSpecies;
  intent: MatchIntent;
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
