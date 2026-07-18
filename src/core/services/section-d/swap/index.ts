import {
  GenHabitLinkItemRequest,
  GenHabitLinkRequest,
  GenHabitRequest,
  GenHabitStackRequest,
  PostGenHabit,
  PostGenHabitLink,
  PostGenHabitLinkItem,
  PostGenHabitStack,
  PostSwapHabit,
  PostSwapHabitLink,
  PostSwapHabitLinkItem,
  SwapHabitLinkItemRequest,
  SwapHabitLinkRequest,
  SwapHabitRequest,
} from "@/core/api/section-d/swap";

export async function processGenHabit(
  habitStackId: string,
  payload: GenHabitRequest,
): Promise<boolean> {
  const { status } = await PostGenHabit(habitStackId, payload);
  return status >= 200 && status < 300;
}

export async function processGenHabitStack(
  userId: string,
  payload: GenHabitStackRequest,
): Promise<boolean> {
  const { status } = await PostGenHabitStack(userId, payload);
  return status >= 200 && status < 300;
}

export async function processGenHabitLink(
  habitId: string,
  payload: GenHabitLinkRequest,
): Promise<boolean> {
  const { status } = await PostGenHabitLink(habitId, payload);
  return status >= 200 && status < 300;
}

export async function processGenHabitLinkItem(
  habitLinkId: string,
  payload: GenHabitLinkItemRequest,
): Promise<boolean> {
  const { status } = await PostGenHabitLinkItem(habitLinkId, payload);
  return status >= 200 && status < 300;
}

export async function swapHabitLinkItem(
  payload: SwapHabitLinkItemRequest,
): Promise<boolean> {
  const { status } = await PostSwapHabitLinkItem(payload);
  return status >= 200 && status < 300;
}

export async function swapHabitLink(
  payload: SwapHabitLinkRequest,
): Promise<boolean> {
  const { status } = await PostSwapHabitLink(payload);
  return status >= 200 && status < 300;
}

export async function swapHabit(payload: SwapHabitRequest): Promise<boolean> {
  const { status } = await PostSwapHabit(payload);
  return status >= 200 && status < 300;
}
