import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_NOCAP_API,
});

export const PurgeHabitStacksByUserId = async (payload: { userId: string }) => {
  const request = `/habit-stack-data-purge/purge/user/${payload.userId}`;
  try {
    const response = await API.delete(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("PurgeHabitStacksByUserId:", err);
    return { data: null, status: 500 };
  }
};

export const PurgeNoCapPostsByUserId = async (payload: { userId: string }) => {
  const request = `/nocap-post-data-purge/purge/user/${payload.userId}`;
  try {
    const response = await API.delete(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("PurgeNoCapPostsByUserId:", err);
    return { data: null, status: 500 };
  }
};

export const DestroyAccountByUserId = async (payload: { userId: string }) => {
  const request = `/habit-stack-data-purge/purge-destroy-account/${payload.userId}`;
  try {
    const response = await API.delete(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("DestroyAccountByUserId:", err);
    return { data: null, status: 500 };
  }
};

export interface IUserRevenueCatApiPayload {
  id: string;
  nocapUserId: string;
  revenueCatUserId: string;
  planId: string;
  billingType: string;
  monthlyCredits: number;
  remainingCredits: number;
  isActive: boolean;
  purchasedAt: string | null;
}

export const GetUserRevenueCatByNocapUserId = async (payload: {
  nocapUserId: string;
}) => {
  const request = `/user-revenue-cat/by-nocap-user-id/${payload.nocapUserId}`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err: any) {
    const status: number = err?.response?.status ?? 500;
    console.log("GetUserRevenueCatByNocapUserId:", err);
    return { data: null, status };
  }
};

export const CreateUserRevenueCat = async (
  payload: IUserRevenueCatApiPayload,
) => {
  const request = `/user-revenue-cat`;
  try {
    const response = await API.post(request, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("CreateUserRevenueCat:", err);
    return { data: null, status: 500 };
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
  const request = `/user-revenue-cat/update-subscription-plan/by-user-id/${payload.userId}`;
  try {
    const response = await API.put(request, payload.body, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("UpdateUserRevenueCatSubscriptionPlan:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateRevenueCatUserId = async (payload: {
  userId: string;
  revenueCatUserId: string;
}) => {
  const request = `/user-revenue-cat/update-subscription-plan-revenuCatUserID/by-user-id/${payload.userId}`;
  try {
    const response = await API.put(
      request,
      { revenueCatUserId: payload.revenueCatUserId },
      { headers: { "Content-Type": "application/json" } },
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("UpdateRevenueCatUserId:", err);
    return { data: null, status: 500 };
  }
};

export const IncreaseRemainingCreditsByUserId = async (payload: {
  userId: string;
  amount: number;
}) => {
  const request = `/user-revenue-cat/remaining-credits/increase/by-user-id/${payload.userId}`;
  try {
    const response = await API.put(
      request,
      { amount: payload.amount },
      { headers: { "Content-Type": "application/json" } },
    );
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("IncreaseRemainingCreditsByUserId:", err);
    return { data: null, status: 500 };
  }
};

export const DecreaseRemainingCreditsByUserId = async (payload: {
  userId: string;
  amount: number;
}) => {
  const request = `/user-revenue-cat/remaining-credits/decrease/by-user-id/${payload.userId}`;
  try {
    const response = await API.put(
      request,
      { amount: payload.amount },
      { headers: { "Content-Type": "application/json" } },
    );
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("DecreaseRemainingCreditsByUserId:", err);
    return { data: null, status: 500 };
  }
};
