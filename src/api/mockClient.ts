import { pets } from "../data/pets";
import type { OwnerPetProfile, Pet } from "../types";
import type {
  AccountDeletionRequest,
  ApiClient,
  AuthRequest,
  AuthSession,
  BreedingEligibility,
  ChatMessage,
  ConversationSummary,
  CreateReportRequest,
  OwnerPetProfileInput,
  SwipeQueueRequest,
} from "./contracts";

const defaultProfile: OwnerPetProfile = {
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

const secondProfile: OwnerPetProfile = {
  id: "pet-demo-mitao",
  name: "米桃",
  species: "cat",
  city: "上海",
  breed: "英短",
  age: "1 岁",
  sex: "unknown",
  intent: "social",
  note: "先线上交流养猫经验，暂不线下合笼。",
  photoCount: 1,
  healthStatus: "pending",
};

const mockState = {
  session: {
    userId: "owner-demo-1",
    displayName: "奶盖的家长",
    activePetId: "pet-demo-naigai",
  } as AuthSession | null,
  ownerPets: [defaultProfile, secondProfile],
  matches: [] as string[],
  passed: [] as string[],
  reports: [] as CreateReportRequest[],
  blockedOwners: [] as string[],
  deletionRequests: [] as AccountDeletionRequest[],
};

function wait<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

function matchPetsByName(names: string[]): Pet[] {
  return names.map((name) => pets.find((pet) => pet.name === name)).filter(Boolean) as Pet[];
}

function updateOwnerPetInState(profile: OwnerPetProfile): OwnerPetProfile {
  mockState.ownerPets = mockState.ownerPets.map((pet) => (pet.id === profile.id ? profile : pet));
  return profile;
}

export const mockApiClient: ApiClient = {
  getSession(): Promise<AuthSession | null> {
    return wait(mockState.session);
  },

  signIn(request: AuthRequest): Promise<AuthSession> {
    mockState.session = {
      userId: "owner-demo-1",
      displayName: request.displayName || "奶盖的家长",
      activePetId: "pet-demo-naigai",
    };
    return wait(mockState.session);
  },

  createAccount(request: AuthRequest): Promise<AuthSession> {
    mockState.session = {
      userId: "owner-demo-1",
      displayName: request.displayName || "奶盖的家长",
      activePetId: "pet-demo-naigai",
    };
    return wait(mockState.session);
  },

  signOut(): Promise<void> {
    mockState.session = null;
    return wait(undefined);
  },

  requestAccountDeletion(request: AccountDeletionRequest): Promise<void> {
    mockState.deletionRequests.push(request);
    return wait(undefined);
  },

  listOwnerPets(): Promise<OwnerPetProfile[]> {
    return wait(mockState.ownerPets);
  },

  getOwnerProfile(): Promise<OwnerPetProfile> {
    const activePet = mockState.ownerPets.find((pet) => pet.id === mockState.session?.activePetId);
    return wait(activePet || mockState.ownerPets[0] || defaultProfile);
  },

  updateOwnerProfile(profile: OwnerPetProfile): Promise<OwnerPetProfile> {
    return wait(updateOwnerPetInState(profile));
  },

  createOwnerPet(profile: OwnerPetProfileInput): Promise<OwnerPetProfile> {
    const created = {
      ...profile,
      id: `pet-demo-${Date.now()}`,
    };
    mockState.ownerPets.push(created);
    if (mockState.session) {
      mockState.session = {
        ...mockState.session,
        activePetId: created.id,
      };
    }
    return wait(created);
  },

  updateOwnerPet(profile: OwnerPetProfile): Promise<OwnerPetProfile> {
    return wait(updateOwnerPetInState(profile));
  },

  deleteOwnerPet(petId: string): Promise<OwnerPetProfile[]> {
    if (mockState.ownerPets.length <= 1) {
      return wait(mockState.ownerPets);
    }
    mockState.ownerPets = mockState.ownerPets.filter((pet) => pet.id !== petId);
    if (mockState.session?.activePetId === petId && mockState.ownerPets[0]) {
      mockState.session = {
        ...mockState.session,
        activePetId: mockState.ownerPets[0].id,
      };
    }
    return wait(mockState.ownerPets);
  },

  setActivePet(petId: string): Promise<AuthSession> {
    const activePet = mockState.ownerPets.find((pet) => pet.id === petId);
    if (!mockState.session || !activePet) {
      return wait({
        userId: "owner-demo-1",
        displayName: "奶盖的家长",
        activePetId: petId,
      });
    }
    mockState.session = {
      ...mockState.session,
      activePetId: petId,
    };
    return wait(mockState.session);
  },

  listSwipeQueue(request: SwipeQueueRequest): Promise<Pet[]> {
    const queue = pets.filter((pet) => {
      const intentMatch = request.intent === "all" || pet.intent === request.intent;
      const speciesMatch = request.species === "all" || pet.species === request.species;
      return intentMatch && speciesMatch;
    });
    return wait(queue);
  },

  likePet(petName: string): Promise<Pet[]> {
    if (!mockState.matches.includes(petName)) {
      mockState.matches.push(petName);
    }
    return wait(matchPetsByName(mockState.matches));
  },

  passPet(petName: string): Promise<void> {
    if (!mockState.passed.includes(petName)) {
      mockState.passed.push(petName);
    }
    return wait(undefined);
  },

  listMatches(): Promise<Pet[]> {
    return wait(matchPetsByName(mockState.matches));
  },

  listConversations(): Promise<ConversationSummary[]> {
    return wait(
      matchPetsByName(mockState.matches).map((pet) => ({
        id: `conversation-${pet.name}`,
        pet,
        lastMessage: pet.opener,
        safetyState: pet.intent === "breeding" ? "breeding_review_required" : "standard",
      })),
    );
  },

  listMessages(conversationId: string): Promise<ChatMessage[]> {
    const petName = conversationId.replace("conversation-", "");
    const pet = pets.find((item) => item.name === petName);
    return wait([
      {
        id: `${conversationId}-message-1`,
        conversationId,
        sender: "match",
        body: pet?.opener || "我们先确认一下宠物状态。",
        createdAt: "2026-04-21T10:00:00.000Z",
      },
      {
        id: `${conversationId}-message-2`,
        conversationId,
        sender: "owner",
        body: mockState.ownerPets.find((pet) => pet.id === mockState.session?.activePetId)?.note || defaultProfile.note,
        createdAt: "2026-04-21T10:01:00.000Z",
      },
      {
        id: `${conversationId}-message-3`,
        conversationId,
        sender: "system",
        body: "见面前请确认牵引、疫苗、过敏和紧急联系人。繁育沟通需先完成认证。",
        createdAt: "2026-04-21T10:02:00.000Z",
      },
    ]);
  },

  report(request: CreateReportRequest): Promise<void> {
    mockState.reports.push(request);
    return wait(undefined);
  },

  blockOwner(ownerId: string): Promise<void> {
    if (!mockState.blockedOwners.includes(ownerId)) {
      mockState.blockedOwners.push(ownerId);
    }
    return wait(undefined);
  },

  unmatch(petName: string): Promise<void> {
    mockState.matches = mockState.matches.filter((name) => name !== petName);
    return wait(undefined);
  },

  getBreedingEligibility(petName: string): Promise<BreedingEligibility> {
    const pet = pets.find((item) => item.name === petName);
    if (pet?.intent !== "breeding") {
      return wait({
        petName,
        status: "not_required",
        requiredEvidence: [],
      });
    }

    return wait({
      petName,
      status: "pending",
      requiredEvidence: ["家长身份核验", "疫苗记录", "年龄与体况证明", "基因筛查"],
      reviewerNote: "繁育沟通前需要补齐材料并等待审核。",
    });
  },
};
