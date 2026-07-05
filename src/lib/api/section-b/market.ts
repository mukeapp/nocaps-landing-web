import { API } from "@/lib/api/client";

// Ported from mobile core/api/section-b/section-b-3/market/index.ts.

export const GetFeaturedCarouselSlides = async () => {
  try {
    const response = await API.get(`/featured-carousel-slides`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetFeaturedCarouselSlides error:", err);
    return { data: null, status: 500 };
  }
};

export const getHabitStackComponentsMarketIsOwnedByAdminUserId = async (payload: {
  marketAdminUserId: string;
  isMarketOwned: boolean;
  sectorId: string;
  pageSize: number;
  pageNumber: number;
}) => {
  try {
    const response = await API.get(
      `/habit-stacks-market/market-admin-user/${payload.marketAdminUserId}/is-market-owned/${payload.isMarketOwned}/sector/${payload.sectorId}/habit-stack-components?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("getHabitStackComponentsMarketIsOwnedByAdminUserId error:", err);
    return { data: null, status: 500 };
  }
};

export const putMarkHabitStackAsMarketPending = async (payload: { valid: boolean; id: string }) => {
  try {
    const response = await API.put(`/habit-stacks/market-pending/${payload.valid}/${payload.id}`, {});
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("putMarkHabitStackAsMarketPending error:", err);
    return { data: null, status: 500 };
  }
};

export const putMarkHabitStackAsMarketInProgress = async (payload: { valid: boolean; id: string }) => {
  try {
    const response = await API.put(`/habit-stacks/market-in-progress/${payload.valid}/${payload.id}`, {});
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("putMarkHabitStackAsMarketInProgress error:", err);
    return { data: null, status: 500 };
  }
};

export const postPublishHabitStackToMarket = async (payload: {
  id: string;
  newOwnerUserId: string;
  oldOwnerUserId: string;
}) => {
  try {
    const response = await API.post(`/habit-stacks-market/publish/${payload.id}`, {
      newOwnerUserId: payload.newOwnerUserId,
      oldOwnerUserId: payload.oldOwnerUserId,
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("postPublishHabitStackToMarket error:", err);
    return { data: null, status: 500 };
  }
};

export const postUnpublishHabitStackFromMarket = async (payload: { id: string }) => {
  try {
    const response = await API.post(`/habit-stacks-market/unpublish/${payload.id}`, {});
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("postUnpublishHabitStackFromMarket error:", err);
    return { data: null, status: 500 };
  }
};

export const getHabitStacksMarketByStatus = async (payload: {
  userId: string;
  sectorId: string;
  status: "market-in-progress" | "market-pending" | "market-published";
  pageSize: number;
  pageNumber: number;
}) => {
  try {
    const response = await API.get(
      `/habit-stacks-market/user/${payload.userId}/sector/${payload.sectorId}/${payload.status}/habit-stack-components?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("getHabitStacksMarketByStatus error:", err);
    return { data: null, status: 500 };
  }
};
