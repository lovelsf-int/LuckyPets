export type IntentFilter = "all" | "social" | "playdate" | "breeding";

export type SpeciesFilter = "all" | "dog" | "cat" | "rabbit";

export type TabKey = "match" | "messages" | "profile";

export type PetSpecies = Exclude<SpeciesFilter, "all">;

export type MatchIntent = Exclude<IntentFilter, "all">;

export type PetSex = "female" | "male" | "unknown";

export type HealthReviewStatus = "not_started" | "pending" | "approved" | "needs_more_info";

export type PetPhoto = {
  id: string;
  petId: string;
  uri: string;
  caption: string;
  status: "uploaded" | "reviewing";
};

export type HealthRecordType = "vaccination" | "parasite_prevention" | "vet_exam" | "genetic_screening";

export type HealthRecord = {
  id: string;
  petId: string;
  type: HealthRecordType;
  title: string;
  issuedAt: string;
  status: HealthReviewStatus;
  isPrivate: boolean;
  note: string;
};

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
