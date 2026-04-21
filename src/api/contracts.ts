import type { HealthRecord, HealthRecordType, IntentFilter, OwnerPetProfile, Pet, PetPhoto, SpeciesFilter } from "../types";

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

export type PetPhotoInput = {
  uri: string;
  caption: string;
};

export type HealthRecordInput = {
  type: HealthRecordType;
  title: string;
  issuedAt: string;
  note: string;
};

export type SwipeQueueRequest = {
  intent: IntentFilter;
  species: SpeciesFilter;
};

export type SwipeAction = "like" | "pass";

export type SwipeEvent = {
  id: string;
  petName: string;
  action: SwipeAction;
  createdAt: string;
};

export type SwipeQueueEmptyReason = "no_candidates" | "filters_too_narrow" | "all_seen" | "blocked_or_unmatched";

export type SwipeQueueMeta = {
  totalCandidates: number;
  skippedByHistory: number;
  emptyReason?: SwipeQueueEmptyReason;
};

export type SwipeQueueResponse = SwipeQueueMeta & {
  pets: Pet[];
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
  listPetPhotos: (petId: string) => Promise<PetPhoto[]>;
  addPetPhoto: (petId: string, photo: PetPhotoInput) => Promise<PetPhoto[]>;
  listHealthRecords: (petId: string) => Promise<HealthRecord[]>;
  addHealthRecord: (petId: string, record: HealthRecordInput) => Promise<HealthRecord[]>;
  listSwipeQueue: (request: SwipeQueueRequest) => Promise<SwipeQueueResponse>;
  likePet: (petName: string) => Promise<Pet[]>;
  passPet: (petName: string) => Promise<void>;
  listSwipeEvents: () => Promise<SwipeEvent[]>;
  listMatches: () => Promise<Pet[]>;
  listConversations: () => Promise<ConversationSummary[]>;
  listMessages: (conversationId: string) => Promise<ChatMessage[]>;
  report: (request: CreateReportRequest) => Promise<void>;
  blockOwner: (ownerId: string) => Promise<void>;
  unmatch: (petName: string) => Promise<void>;
  getBreedingEligibility: (petName: string) => Promise<BreedingEligibility>;
};
