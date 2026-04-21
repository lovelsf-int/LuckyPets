import { pets } from "../data/pets";
import type { OwnerPetProfile, Pet } from "../types";
import type {
  ApiClient,
  AuthSession,
  BreedingEligibility,
  ChatMessage,
  ConversationSummary,
  CreateReportRequest,
  SwipeQueueRequest,
} from "./contracts";

const defaultProfile: OwnerPetProfile = {
  name: "奶盖",
  city: "上海",
  breed: "金毛",
  age: "2 岁",
  note: "第一次见面不脱牵引，先短时间公园同行。",
};

const mockState = {
  profile: defaultProfile,
  matches: [] as string[],
  passed: [] as string[],
  reports: [] as CreateReportRequest[],
  blockedOwners: [] as string[],
};

function wait<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

function matchPetsByName(names: string[]): Pet[] {
  return names.map((name) => pets.find((pet) => pet.name === name)).filter(Boolean) as Pet[];
}

export const mockApiClient: ApiClient = {
  getSession(): Promise<AuthSession> {
    return wait({
      userId: "owner-demo-1",
      displayName: "奶盖的家长",
      activePetId: "pet-demo-naigai",
    });
  },

  getOwnerProfile(): Promise<OwnerPetProfile> {
    return wait(mockState.profile);
  },

  updateOwnerProfile(profile: OwnerPetProfile): Promise<OwnerPetProfile> {
    mockState.profile = profile;
    return wait(mockState.profile);
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
        body: mockState.profile.note,
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
