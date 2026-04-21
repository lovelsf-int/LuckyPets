import type { IntentFilter, OwnerPetProfile, Pet, SpeciesFilter } from "../types";

export type AuthSession = {
  userId: string;
  displayName: string;
  activePetId: string;
};

export type AuthRequest = {
  email: string;
  displayName: string;
};

export type AccountDeletionRequest = {
  reason: string;
};

export type OwnerPetProfileInput = Omit<OwnerPetProfile, "id">;

export type SwipeQueueRequest = {
  intent: IntentFilter;
  species: SpeciesFilter;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  sender: "owner" | "match" | "system";
  body: string;
  createdAt: string;
};

export type ConversationSummary = {
  id: string;
  pet: Pet;
  lastMessage: string;
  safetyState: "standard" | "breeding_review_required" | "blocked";
};

export type ReportCategory =
  | "fraud"
  | "neglect"
  | "unsafe_breeding"
  | "harassment"
  | "spam"
  | "illegal_sale";

export type CreateReportRequest = {
  targetType: "pet" | "conversation" | "message" | "owner";
  targetId: string;
  category: ReportCategory;
  details: string;
};

export type ReviewStatus = "not_required" | "pending" | "approved" | "rejected" | "expired";

export type BreedingEligibility = {
  petName: string;
  status: ReviewStatus;
  requiredEvidence: string[];
  reviewerNote?: string;
};

export type ApiClient = {
  getSession: () => Promise<AuthSession | null>;
  signIn: (request: AuthRequest) => Promise<AuthSession>;
  createAccount: (request: AuthRequest) => Promise<AuthSession>;
  signOut: () => Promise<void>;
  requestAccountDeletion: (request: AccountDeletionRequest) => Promise<void>;
  listOwnerPets: () => Promise<OwnerPetProfile[]>;
  getOwnerProfile: () => Promise<OwnerPetProfile>;
  updateOwnerProfile: (profile: OwnerPetProfile) => Promise<OwnerPetProfile>;
  createOwnerPet: (profile: OwnerPetProfileInput) => Promise<OwnerPetProfile>;
  updateOwnerPet: (profile: OwnerPetProfile) => Promise<OwnerPetProfile>;
  deleteOwnerPet: (petId: string) => Promise<OwnerPetProfile[]>;
  setActivePet: (petId: string) => Promise<AuthSession>;
  listSwipeQueue: (request: SwipeQueueRequest) => Promise<Pet[]>;
  likePet: (petName: string) => Promise<Pet[]>;
  passPet: (petName: string) => Promise<void>;
  listMatches: () => Promise<Pet[]>;
  listConversations: () => Promise<ConversationSummary[]>;
  listMessages: (conversationId: string) => Promise<ChatMessage[]>;
  report: (request: CreateReportRequest) => Promise<void>;
  blockOwner: (ownerId: string) => Promise<void>;
  unmatch: (petName: string) => Promise<void>;
  getBreedingEligibility: (petName: string) => Promise<BreedingEligibility>;
};
