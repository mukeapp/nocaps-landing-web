import { API } from "@/lib/api/client";

// Ported from mobile core/api/section-b/section-b-5/index.ts.

export const PurgeHabitStacksByUserId = async (payload: { userId: string }) => {
  try {
    const response = await API.delete(`/habit-stack-data-purge/purge/user/${payload.userId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("PurgeHabitStacksByUserId error:", err);
    return { data: null, status: 500 };
  }
};

export const PurgeNoCapPostsByUserId = async (payload: { userId: string }) => {
  try {
    const response = await API.delete(`/nocap-post-data-purge/purge/user/${payload.userId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("PurgeNoCapPostsByUserId error:", err);
    return { data: null, status: 500 };
  }
};

export const DestroyAccountByUserId = async (payload: { userId: string }) => {
  try {
    const response = await API.delete(`/habit-stack-data-purge/purge-destroy-account/${payload.userId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DestroyAccountByUserId error:", err);
    return { data: null, status: 500 };
  }
};

export const GetUserRevenueCatByNocapUserId = async (payload: { nocapUserId: string }) => {
  try {
    const response = await API.get(`/user-revenue-cat/by-nocap-user-id/${payload.nocapUserId}`);
    return { data: response.data, status: response.status };
  } catch (err: any) {
    const status: number = err?.response?.status ?? 500;
    console.log("GetUserRevenueCatByNocapUserId error:", err);
    return { data: null, status };
  }
};

export interface IUpdateSubscriptionPlanPayload {
  planId: string;
  billingType: string;
  monthlyCredits: number;
  remainingCredits: number;
  purchasedAt: string | null;
}

export const UpdateUserRevenueCatSubscriptionPlan = async (payload: {
  userId: string;
  body: IUpdateSubscriptionPlanPayload;
}) => {
  try {
    const response = await API.put(
      `/user-revenue-cat/update-subscription-plan/by-user-id/${payload.userId}`,
      payload.body,
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("UpdateUserRevenueCatSubscriptionPlan error:", err);
    return { data: null, status: 500 };
  }
};

export const IncreaseRemainingCreditsByUserId = async (payload: {
  userId: string;
  amount: number;
}) => {
  try {
    const response = await API.put(
      `/user-revenue-cat/remaining-credits/increase/by-user-id/${payload.userId}`,
      { amount: payload.amount },
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("IncreaseRemainingCreditsByUserId error:", err);
    return { data: null, status: 500 };
  }
};

export const DecreaseRemainingCreditsByUserId = async (payload: {
  userId: string;
  amount: number;
}) => {
  try {
    const response = await API.put(
      `/user-revenue-cat/remaining-credits/decrease/by-user-id/${payload.userId}`,
      { amount: payload.amount },
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DecreaseRemainingCreditsByUserId error:", err);
    return { data: null, status: 500 };
  }
};
