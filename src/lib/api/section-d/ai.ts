import { API } from "@/lib/api/client";
import { AiAPI } from "@/lib/api/ai-client";
import type {
  HabitComponent,
  HabitLinkComponent,
  HabitLinkItemComponent,
  HabitStackComponent,
} from "@/types/section-b/habit";

// Ported from mobile core/api/section-d/swap/index.ts — generator/swap calls
// go to the NOCAP_AI microservice; the apply/persist calls go to the main API.

export interface GenerateResponse<T> {
  generatedList: T[];
  summary: string;
}

export const GetGeneratedHabitStacks = async (steerDescription: string, model: string) => {
  try {
    const response = await AiAPI.post(`/ai/generator/habit-stack?model=${model}`, { steerDescription });
    return { data: response.data as GenerateResponse<HabitStackComponent>, status: response.status };
  } catch (err) {
    console.log("GetGeneratedHabitStacks error:", err);
    return { data: null, status: 500 };
  }
};

export const GetGeneratedHabits = async (
  habitStackDocumentId: string,
  steerDescription: string,
  model: string,
) => {
  try {
    const response = await AiAPI.post(`/ai/generator/habit/${habitStackDocumentId}?model=${model}`, {
      steerDescription,
    });
    return { data: response.data as GenerateResponse<HabitComponent>, status: response.status };
  } catch (err) {
    console.log("GetGeneratedHabits error:", err);
    return { data: null, status: 500 };
  }
};

export const GetGeneratedHabitLinks = async (
  habitDocumentId: string,
  steerDescription: string,
  model: string,
) => {
  try {
    const response = await AiAPI.post(`/ai/generator/habit-link/${habitDocumentId}?model=${model}`, {
      steerDescription,
    });
    return { data: response.data as GenerateResponse<HabitLinkComponent>, status: response.status };
  } catch (err) {
    console.log("GetGeneratedHabitLinks error:", err);
    return { data: null, status: 500 };
  }
};

export const GetGeneratedHabitLinkItems = async (
  habitLinkDocumentId: string,
  steerDescription: string,
  model: string,
) => {
  try {
    const response = await AiAPI.post(`/ai/generator/habit-link-item/${habitLinkDocumentId}?model=${model}`, {
      steerDescription,
    });
    return { data: response.data as GenerateResponse<HabitLinkItemComponent>, status: response.status };
  } catch (err) {
    console.log("GetGeneratedHabitLinkItems error:", err);
    return { data: null, status: 500 };
  }
};

export interface SwapResponse<T> {
  summary: string;
  habitSwapCandidateList?: T[];
  habitLinkSwapCandidateList?: T[];
  habitLinkItemSwapCandidateList?: T[];
}

export const GetSwapHabitCandidates = async (habitDocumentId: string, model: string) => {
  try {
    const response = await AiAPI.get(`/ai/swap/habit/${habitDocumentId}?model=${model}`);
    return { data: response.data as SwapResponse<HabitComponent>, status: response.status };
  } catch (err) {
    console.log("GetSwapHabitCandidates error:", err);
    return { data: null, status: 500 };
  }
};

export const GetSwapHabitLinkCandidates = async (habitLinkDocumentId: string, model: string) => {
  try {
    const response = await AiAPI.get(`/ai/swap/habit-link/${habitLinkDocumentId}?model=${model}`);
    return { data: response.data as SwapResponse<HabitLinkComponent>, status: response.status };
  } catch (err) {
    console.log("GetSwapHabitLinkCandidates error:", err);
    return { data: null, status: 500 };
  }
};

export const GetSwapHabitLinkItemCandidates = async (habitLinkItemDocumentId: string, model: string) => {
  try {
    const response = await AiAPI.get(`/ai/swap/habit-link-item/${habitLinkItemDocumentId}?model=${model}`);
    return { data: response.data as SwapResponse<HabitLinkItemComponent>, status: response.status };
  } catch (err) {
    console.log("GetSwapHabitLinkItemCandidates error:", err);
    return { data: null, status: 500 };
  }
};

// ── Apply/persist endpoints (main NOCAP_API) ─────────────────────────────────

export const PostGenHabitStack = async (userId: string, genCandidate: HabitStackComponent) => {
  try {
    const response = await API.post(`/habit-stack-gen/${userId}`, { genCandidate });
    return { status: response.status };
  } catch (err) {
    console.log("PostGenHabitStack error:", err);
    return { status: 500 };
  }
};

export const PostGenHabit = async (habitStackId: string, genCandidate: HabitComponent) => {
  try {
    const response = await API.post(`/habit-gen/${habitStackId}`, { genCandidate });
    return { status: response.status };
  } catch (err) {
    console.log("PostGenHabit error:", err);
    return { status: 500 };
  }
};

export const PostGenHabitLink = async (habitId: string, genCandidate: HabitLinkComponent) => {
  try {
    const response = await API.post(`/habit-link-gen/${habitId}`, { genCandidate });
    return { status: response.status };
  } catch (err) {
    console.log("PostGenHabitLink error:", err);
    return { status: 500 };
  }
};

export const PostGenHabitLinkItem = async (habitLinkId: string, genCandidate: HabitLinkItemComponent) => {
  try {
    const response = await API.post(`/habit-link-item-gen/${habitLinkId}`, { genCandidate });
    return { status: response.status };
  } catch (err) {
    console.log("PostGenHabitLinkItem error:", err);
    return { status: 500 };
  }
};

export const PostSwapHabit = async (payload: {
  currentItem: HabitComponent;
  swapCandidate: HabitComponent;
}) => {
  try {
    const response = await API.post(`/habit-swap/swap`, payload);
    return { status: response.status };
  } catch (err) {
    console.log("PostSwapHabit error:", err);
    return { status: 500 };
  }
};

export const PostSwapHabitLink = async (payload: {
  currentItem: HabitLinkComponent;
  swapCandidate: HabitLinkComponent;
}) => {
  try {
    const response = await API.post(`/habit-link-swap/swap`, payload);
    return { status: response.status };
  } catch (err) {
    console.log("PostSwapHabitLink error:", err);
    return { status: 500 };
  }
};

export const PostSwapHabitLinkItem = async (payload: {
  currentItem: HabitLinkItemComponent;
  swapCandidate: HabitLinkItemComponent;
}) => {
  try {
    const response = await API.post(`/habit-link-item-swap/swap`, payload);
    return { status: response.status };
  } catch (err) {
    console.log("PostSwapHabitLinkItem error:", err);
    return { status: 500 };
  }
};
