import {
  getHabitStacksMarketPending,
  getHabitStacksMarketPublished,
  postPublishHabitStackToMarket,
  postUnpublishHabitStackFromMarket,
  putMarkHabitStackAsMarketInProgress,
  putMarkHabitStackAsMarketPending,
  putMarkHabitStackAsMarketPublished,
} from "@/core/api/section-b";
import { Payload } from "@/core/models/section-a/api";
import {
  FetchResult,
  HabitStackComponent,
  HabitStackComponentPagination,
  HabitStackMarketComponent,
} from "@/core/models/section-b";
import { getHabitStacksMarketInProgress } from "@/core/api/section-b";
import {getHabitStackComponentsMarketIsOwnedByAdminUserId, getHabitStackComponentsMarketIsOwnedByUserId, getHabitStacksMarketOwnerComponents} from "@/core/api/section-b/section-b-3/market";

export const updateMarkHabitStackAsMarketInProgress = async (
  payload: Payload
): Promise<HabitStackMarketComponent> => {
  const res = await putMarkHabitStackAsMarketInProgress(payload);
  return res?.data || null;
};

export const fetchHabitStacksMarketInProgress = async (
  payload: Payload
): Promise<HabitStackComponentPagination> => {
  const res = await getHabitStacksMarketInProgress(payload);
  return res?.data || null;
};
export const fetchHabitStacksMarketPending = async (
  payload: Payload
): Promise<HabitStackComponentPagination> => {
  const res = await getHabitStacksMarketPending(payload);
  return res?.data || null;
};

export const fetchHabitStacksMarketPublished = async (
  payload: Payload
): Promise<HabitStackComponentPagination> => {
  const res = await getHabitStacksMarketPublished(payload);
  return res?.data || null;
};

export const updateMarkHabitStackAsMarketPending = async (
  payload: Payload
): Promise<HabitStackMarketComponent> => {
  const res = await putMarkHabitStackAsMarketPending(payload);
  return res?.data || null;
};

export const updateMarkHabitStackAsMarketPublished = async (
  payload: Payload
): Promise<HabitStackMarketComponent> => {
  const res = await putMarkHabitStackAsMarketPublished(payload);
  return res?.data || null;
};

export const updatePublishHabitStackToMarket = async (
  payload: Payload
): Promise<HabitStackComponent> => {
  const res = await postPublishHabitStackToMarket(payload);
  return res?.data || null;
};

export const updateUnpublishHabitStackFromMarket = async (
  payload: Payload
): Promise<HabitStackComponent> => {
  const res = await postUnpublishHabitStackFromMarket(payload);
  return res?.data || null;
};

export const fetchHabitStacksMarketOwnerComponents = async (
  payload: Payload
): Promise<HabitStackComponentPagination> => {
  const res = await getHabitStacksMarketOwnerComponents(payload);
  return res?.data || null;
};


export const fetchHabitStackComponentsMarketIsOwnedByUserId = async (
  payload: Payload
): Promise<HabitStackComponentPagination> => {
  const res = await getHabitStackComponentsMarketIsOwnedByUserId(payload);
  return res?.data || null;
};

// getHabitStackComponentsMarketIsOwnedByAdminUserId
export const fetchHabitStackComponentsMarketIsOwnedByAdminUserId = async (
  payload: Payload
): Promise<HabitStackComponentPagination> => {
  const res = await getHabitStackComponentsMarketIsOwnedByAdminUserId(payload);
  return res?.data || null;
};

export const fetchHabitStackComponentsMarketIsOwnedByAdminUserIdForPagination = async (
  payload: Payload) => {
  const res = await fetchHabitStackComponentsMarketIsOwnedByAdminUserId(payload);
  return mapHabitStackComponentsForPagination(res);
};

function mapHabitStackComponentsForPagination(res: HabitStackComponentPagination): FetchResult<HabitStackComponent> {
  const items: HabitStackComponent[] = res.habitStackComponents ?? [];

  const hasMore = (res.pageNumber ?? 1) < (res.numberOfPages ?? 1);
  return { items, hasMore };
}