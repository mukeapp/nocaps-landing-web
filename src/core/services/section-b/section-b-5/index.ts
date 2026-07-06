import {
  CreateUserRevenueCat,
  DecreaseRemainingCreditsByUserId,
  DestroyAccountByUserId,
  GetUserRevenueCatByNocapUserId,
  IncreaseRemainingCreditsByUserId,
  IUpdateSubscriptionPlanPayload,
  IUserRevenueCatApiPayload,
  PurgeHabitStacksByUserId,
  PurgeNoCapPostsByUserId,
  UpdateRevenueCatUserId,
  UpdateUserRevenueCatSubscriptionPlan,
} from "@/core/api/section-b";

export const purgeHabitStacksByUserId = async (userId: string) => {
  return PurgeHabitStacksByUserId({ userId });
};

export const purgeNoCapPostsByUserId = async (userId: string) => {
  return PurgeNoCapPostsByUserId({ userId });
};

export const destroyAccountByUserId = async (userId: string) => {
  return DestroyAccountByUserId({ userId });
};

export const getUserRevenueCatByNocapUserId = async (nocapUserId: string) => {
  return GetUserRevenueCatByNocapUserId({ nocapUserId });
};

export const createUserRevenueCat = async (
  payload: IUserRevenueCatApiPayload,
) => {
  return CreateUserRevenueCat(payload);
};

export const updateUserRevenueCatSubscriptionPlan = async (
  userId: string,
  body: IUpdateSubscriptionPlanPayload,
) => {
  return UpdateUserRevenueCatSubscriptionPlan({ userId, body });
};

export const updateRevenueCatUserId = async (
  userId: string,
  revenueCatUserId: string,
) => UpdateRevenueCatUserId({ userId, revenueCatUserId });

export const increaseRemainingCreditsByUserId = async (
  userId: string,
  amount: number,
) => {
  return IncreaseRemainingCreditsByUserId({ userId, amount });
};

export const decreaseRemainingCreditsByUserId = async (
  userId: string,
  amount: number,
) => {
  return DecreaseRemainingCreditsByUserId({ userId, amount });
};
