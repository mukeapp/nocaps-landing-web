import {Payload} from "@/core/models/section-a";
import {apiRequest, handleApiError} from "@/core/utils";

export const putMarkHabitStackAsMarketInProgress = async (payload: Payload) => {
  try {
    const request = `/habit-stacks/market-in-progress/${payload.valid}/${payload.id}`;
    console.log("PUT Request:", request);
    return await apiRequest("put", request, {}, "marking habit stack as market in progress");
  } catch (err) {
    return handleApiError(err, "markHabitStackAsMarketInProgress");
  }
}

export const putMarkHabitStackAsMarketPending = async (payload: Payload) => {
  try {
    const request = `/habit-stacks/market-pending/${payload.valid}/${payload.id}`;
    console.log("PUT Request:", request);
    return await apiRequest("put", request, {}, "marking habit stack as market pending");
  } catch (err) {
    return handleApiError(err, "markHabitStackAsMarketPending");
  }
}

export const putMarkHabitStackAsMarketPublished = async (payload: Payload) => {
  try {
    const request = `/habit-stacks/market-published/${payload.valid}/${payload.id}`;
    console.log("PUT Request:", request);
    return await apiRequest("put", request, {}, "marking habit stack as market published");
  } catch (err) {
    return handleApiError(err, "markHabitStackAsMarketPublished");
  }
}

export const postPublishHabitStackToMarket = async (payload: Payload) => {
  try {
    const request = `/habit-stacks-market/publish/${payload.id}`;
    console.log("POST Request:", request);
    const body = {
      newOwnerUserId: payload.newOwnerUserId,
      oldOwnerUserId: payload.oldOwnerUserId,
    };
    console.log("POST Body:", body);
    return await apiRequest("post", request, body, "publishing habit stack to market");
  } catch (err) {
    return handleApiError(err, "publishHabitStackToMarket");
  }
}

export const postUnpublishHabitStackFromMarket = async (payload: Payload) => {
  try {
    const request = `/habit-stacks-market/unpublish/${payload.id}`;
    console.log("POST Request:", request);
    return await apiRequest("post", request, {}, "unpublishing habit stack from market");
  } catch (err) {
    return handleApiError(err, "unpublishHabitStackFromMarket");
  }
}

export const getHabitStacksMarketInProgress = async (payload: Payload) => {
  try {
    const request = `/habit-stacks-market/user/${payload.userId}/sector/${payload.sectorId}/market-in-progress/habit-stack-components?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`;
    console.log("GET Request:", request);
    return await apiRequest("get", request, {}, "fetching habit stacks market in progress");
  } catch (err) {
    return handleApiError(err, "getHabitStacksMarketInProgress");
  }
}

export const getHabitStacksMarketPending = async (payload: Payload) => {
  try {
    const request = `/habit-stacks-market/user/${payload.userId}/sector/${payload.sectorId}/market-pending/habit-stack-components?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`;
    console.log("GET Request:", request);
    return await apiRequest("get", request, {}, "fetching habit stacks market pending");
  } catch (err) {
    return handleApiError(err, "getHabitStacksMarketPending");
  }
}

export const getHabitStacksMarketPublished = async (payload: Payload) => {
  try {
    const request = `/habit-stacks-market/user/${payload.userId}/sector/${payload.sectorId}/market-published/habit-stack-components?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`;
    console.log("GET Request:", request);
    return await apiRequest("get", request, {}, "fetching habit stacks market published");
  } catch (err) {
    return handleApiError(err, "getHabitStacksMarketPublished");
  }
}


export const getHabitStacksMarketOwnerComponents = async (payload: Payload) => {
  try {
    const request = `/habit-stacks-market/owners/${payload.userId}/sectors/${payload.sectorId}/habit-stacks-components?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`;
    console.log("GET Request:", request);
    return await apiRequest("get", request, {}, "fetching habit stacks market owner components");
  } catch (err) {
    return handleApiError(err, "getHabitStacksMarketOwnerComponents");
  }
}

// 'http://localhost:3000/habit-stacks-market/market-admin-user/9CdfyBf8mVdDk99ynT09XJ4ZJAT2/market-owner/OwAIOvxGcuZMR51uLKoWsXw9NAF3/is-market-owned/true/sector/sector-health-fitness-000/habit-stack-components?pageSize=5&pageNumber=1'
export const getHabitStackComponentsMarketIsOwnedByUserId = async (payload: Payload) => {
  try {
    const request = `/habit-stacks-market/market-admin-user/${payload.marketAdminUserId}/market-owner/${payload.marketOwnerId}/is-market-owned/${payload.isMarketOwned}/sector/${payload.sectorId}/habit-stack-components?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`;
    console.log("GET Request:", request);
    return await apiRequest("get", request, {}, "fetching habit stacks market is owned");
  } catch (err) {
    return handleApiError(err, "getHabitStacksMarketIsOwned");
  }
}

// curl -X 'GET' \
//  'http://localhost:3000/habit-stacks-market/market-admin-user/9CdfyBf8mVdDk99ynT09XJ4ZJAT2/is-market-owned/true/sector/sector-health-fitness-000/habit-stacks?pageSize=5&pageNumber=1'
export const getHabitStackComponentsMarketIsOwnedByAdminUserId = async (payload: Payload) => {
  try {
    const request = `/habit-stacks-market/market-admin-user/${payload.marketAdminUserId}/is-market-owned/${payload.isMarketOwned}/sector/${payload.sectorId}/habit-stack-components?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`;
    console.log("GET Request:", request);
    return await apiRequest("get", request, {}, "fetching habit stacks market is owned by admin user");
  } catch (err) {
    return handleApiError(err, "getHabitStacksMarketIsOwnedByAdminUserId");
  }
}

export const GetFeaturedCarouselSlides = async () => {
  try {
    const request = `/featured-carousel-slides`;
    return await apiRequest("get", request, {}, "fetching featured carousel slides");
  } catch (err) {
    return handleApiError(err, "getFeaturedCarouselSlides");
  }
};
