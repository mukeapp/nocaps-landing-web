import {
  HabitComponent,
  HabitLinkComponent,
  HabitLinkItemComponent,
  HabitStackComponent,
} from "@/core/models/section-b";
import {Timeout} from "@/core/utils/utilities/timeout";
import axios from "axios";

export interface HabitLinkSwapResponse {
  habitLinkSwapCandidateList: HabitLinkComponent[];
  summary: string;
}

export const GetSwapHabitLinkCandidates = async (
  habitLinkDocumentId: string,
  model: string = "claude-sonnet-4-6",
): Promise<{ data: HabitLinkSwapResponse | null; status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/swap/habit-link/${habitLinkDocumentId}?model=${model}`;
  try {
    const response = await axios.get(request, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.swapHabitLink,
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetSwapHabitLinkCandidates error:", err);
    return { data: null, status: 500 };
  }
};

export interface HabitLinkItemSwapResponse {
  habitLinkItemSwapCandidateList: HabitLinkItemComponent[];
  summary: string;
}

export interface HabitSwapResponse {
  habitSwapCandidateList: HabitComponent[];
  summary: string;
}

export const GetSwapHabitCandidates = async (
  habitDocumentId: string,
  model: string = "claude-sonnet-4-6",
): Promise<{ data: HabitSwapResponse | null; status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/swap/habit/${habitDocumentId}?model=${model}`;
  try {
    const response = await axios.get(request, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.swapHabit,
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetSwapHabitCandidates error:", err);
    return { data: null, status: 500 };
  }
};

export interface HabitLinkItemGenerateResponse {
  generatedList: HabitLinkItemComponent[];
  summary: string;
}

export const GetGeneratedHabitLinkItems = async (
  habitLinkDocumentId: string,
  steerDescription: string,
  model: string = "claude-sonnet-4-6",
): Promise<{ data: HabitLinkItemGenerateResponse | null; status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/generator/habit-link-item/${habitLinkDocumentId}?model=${model}`;
  try {
    const response = await axios.post(request, { steerDescription }, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.generateHabitLinkItem,
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetGeneratedHabitLinkItems error:", err);
    return { data: null, status: 500 };
  }
};

export interface HabitLinkGenerateResponse {
  generatedList: HabitLinkComponent[];
  summary: string;
}

export const GetGeneratedHabitLinks = async (
  habitDocumentId: string,
  steerDescription: string,
  model: string = "claude-sonnet-4-6",
): Promise<{ data: HabitLinkGenerateResponse | null; status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/generator/habit-link/${habitDocumentId}?model=${model}`;
  try {
    const response = await axios.post(request, { steerDescription }, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.generateHabitLink,
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetGeneratedHabitLinks error:", err);
    return { data: null, status: 500 };
  }
};

export interface HabitGenerateResponse {
  generatedList: HabitComponent[];
  summary: string;
}

export const GetGeneratedHabits = async (
  habitStackDocumentId: string,
  steerDescription: string,
  model: string = "claude-sonnet-4-6",
): Promise<{ data: HabitGenerateResponse | null; status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/generator/habit/${habitStackDocumentId}?model=${model}`;
  try {
    const response = await axios.post(request, { steerDescription }, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.generateHabit,
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetGeneratedHabits error:", err);
    return { data: null, status: 500 };
  }
};

export interface HabitStackGenerateResponse {
  generatedList: HabitStackComponent[];
  summary: string;
}

export const GetGeneratedHabitStacks = async (
  steerDescription: string,
  model: string = "claude-sonnet-4-6",
): Promise<{
  data: HabitStackGenerateResponse | null;
  status: number;
}> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/generator/habit-stack?model=${model}`;
  try {
    const response = await axios.post(request, { steerDescription }, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.generateHabitStacks,
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetGeneratedHabitStacks error:", err);
    return { data: null, status: 500 };
  }
};

export const GetSwapHabitLinkItemCandidates = async (
  habitLinkItemDocumentId: string,
  model: string = "claude-sonnet-4-6",
): Promise<{ data: HabitLinkItemSwapResponse | null; status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_AI}/ai/swap/habit-link-item/${habitLinkItemDocumentId}?model=${model}`;
  try {
    const response = await axios.get(request, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      timeout: Timeout.swapHabitLinkItem,
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("GetSwapHabitLinkItemCandidates error:", err);
    return { data: null, status: 500 };
  }
};

export interface GenHabitLinkItemRequest {
  genCandidate: HabitLinkItemComponent;
}

export const PostGenHabitLinkItem = async (
  habitLinkId: string,
  payload: GenHabitLinkItemRequest,
): Promise<{ status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_API}/habit-link-item-gen/${habitLinkId}`;
  try {
    const response = await axios.post(request, payload, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.postOperation,
    });
    return { status: response.status };
  } catch (err) {
    console.log("PostGenHabitLinkItem error:", err);
    return { status: 500 };
  }
};

export interface GenHabitLinkRequest {
  genCandidate: HabitLinkComponent;
}

export const PostGenHabitLink = async (
  habitId: string,
  payload: GenHabitLinkRequest,
): Promise<{ status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_API}/habit-link-gen/${habitId}`;
  try {
    const response = await axios.post(request, payload, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.postOperation,
    });
    return { status: response.status };
  } catch (err) {
    console.log("PostGenHabitLink error:", err);
    return { status: 500 };
  }
};

export interface GenHabitRequest {
  genCandidate: HabitComponent;
}

export const PostGenHabit = async (
  habitStackId: string,
  payload: GenHabitRequest,
): Promise<{ status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_API}/habit-gen/${habitStackId}`;
  try {
    const response = await axios.post(request, payload, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.postOperation,
    });
    return { status: response.status };
  } catch (err) {
    console.log("PostGenHabit error:", err);
    return { status: 500 };
  }
};

export interface GenHabitStackRequest {
  genCandidate: HabitStackComponent;
}

export const PostGenHabitStack = async (
  userId: string,
  payload: GenHabitStackRequest,
): Promise<{ status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_API}/habit-stack-gen/${userId}`;
  try {
    const response = await axios.post(request, payload, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.postOperation,
    });
    return { status: response.status };
  } catch (err) {
    console.log("PostGenHabitStack error:", err);
    return { status: 500 };
  }
};

export interface SwapHabitLinkItemRequest {
  currentItem: HabitLinkItemComponent;
  swapCandidate: HabitLinkItemComponent;
}

export const PostSwapHabitLinkItem = async (
  payload: SwapHabitLinkItemRequest,
): Promise<{ status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_API}/habit-link-item-swap/swap`;
  try {
    const response = await axios.post(request, payload, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.postOperation,
    });
    return { status: response.status };
  } catch (err) {
    console.log("PostSwapHabitLinkItem error:", err);
    return { status: 500 };
  }
};

export interface SwapHabitLinkRequest {
  currentItem: HabitLinkComponent;
  swapCandidate: HabitLinkComponent;
}

export const PostSwapHabitLink = async (
  payload: SwapHabitLinkRequest,
): Promise<{ status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_API}/habit-link-swap/swap`;
  try {
    const response = await axios.post(request, payload, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.postOperation,
    });
    return { status: response.status };
  } catch (err) {
    console.log("PostSwapHabitLink error:", err);
    return { status: 500 };
  }
};

export interface SwapHabitRequest {
  currentItem: HabitComponent;
  swapCandidate: HabitComponent;
}

export const PostSwapHabit = async (
  payload: SwapHabitRequest,
): Promise<{ status: number }> => {
  const request = `${process.env.EXPO_PUBLIC_API_NOCAP_API}/habit-swap/swap`;
  try {
    const response = await axios.post(request, payload, {
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      timeout: Timeout.postOperation,
    });
    return { status: response.status };
  } catch (err) {
    console.log("PostSwapHabit error:", err);
    return { status: 500 };
  }
};
