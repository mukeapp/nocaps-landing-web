import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_NOCAP_API,
});

export const getHabitStackComponentsByUserId = async (payload: any) => {
  const request = `/habit-stack-components/user/${payload.id}?cache_bust=${new Date().getTime()}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("request:", 'https://wise-sheela-mukeapps-13e6588d.koyeb.app' + request);
    console.log("payload:", payload);
    console.log("getHabitStackComponentsByUserId error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const DeleteHabitStack = async (payload: any) => {
  // const request = `/habit-stacks/${payload.id}`;
  const request = `/habit-stack-data-purge/purge/${payload?.id}`;
  try {
    const response = await API.delete(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("DeleteHabitStack error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const GetAllSectorComponents = async () => {
  const request = `/sector-components`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("GetAllSectorComponents error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const GetAllSectorsFullComponent = async (payload: any) => {
  const request = `/sectors-full-component/${payload?.doc}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("GetAllSectorsFullComponent error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const UpdateHabitStack = async (payload: any) => {
  const request = `/habit-stacks/${payload.data.id}`;
  try {
    const response = await API.put(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("UpdateHabitStack error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const SaveHabitStack = async (payload: any) => {
  const request = `/habit-stacks`;
  try {
    const response = await API.post(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("SaveHabitStack error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const GetSectorById = async (payload: any) => {
  const request = `/sectors/${payload.id}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("GetSectorById error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const DeleteHabitOnly = async (payload: any) => {
  // const request = `/habits/${payload.id}`;
  const request = `/habit-data-etl/purge-habit-data/${payload?.id}`;
  try {
    const response = await API.delete(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("DeleteHabitOnly error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const DeleteHabitLinks = async (payload: any) => {
  // const request = `/habit-links/${payload.id}`;
  const request = `/habitLink-data-etl/purge-habit-link-data/${payload?.id}`;
  try {
    const response = await API.delete(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("DeleteHabitLinks error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const UpdateHabitLinks = async (payload: any) => {
  const request = `/habit-links/${payload.docid}`;
  try {
    const response = await API.put(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("UpdateHabitLinks error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

/**
 * Fetch habit stack components by sector ID
 * @param sectorId - The ID of the sector
 * @returns The habit stack components for the specified sector
 */
export const fetchHabitStackComponentsBySectorId = async (sectorId: string) => {
  const request = `/habit-stack-components/sector/${sectorId}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("fetchHabitStackComponentsBySectorId error:", err);
    return { data: null, status: 500 };
  }
};

/**
 * Fetch habit stack components by user ID and sector ID
 * @param userId - The ID of the user
 * @param sectorId - The ID of the sector
 * @returns The habit stack components for the specified user and sector
 */
export const fetchHabitStackComponentsByUserAndSector = async (
  userId: string,
  sectorId: string
) => {
  const request = `/habit-stack-components/user/${userId}/sector/${sectorId}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("fetchHabitStackComponentsByUserAndSector error:", err);
    return { data: null, status: 500 };
  }
};

/**
 * Fetch habit stack components by user IDs String array and sector ID
 * @param userIds - The IDs of the users. send as body { userIds: string[] }
 * @param sectorId - The ID of the sector. send as query param ?sectorId=xxx
 * @returns The habit stack components for the specified user and sector
 */
export const FetchHabitStackComponentsByUserIdsAndSectorId = async (
  payload: any
) => {
  const { userIds, sectorId } = payload;
  try {
    const response = await API.post(
      `/habit-stack-components/users/sector/${sectorId}`,
      {
        userIds,
      }
    );
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("GetHabitStackComponentsByUserIdsAndSectorId error:", err);
    return { data: null, status: 500 };
  }
};

export const FetchHabitStackComponentsByUserIdsAndSectorIdAndHideFromFriends = async (payload: {
  userIds: string[];
  sectorId: string;
  hideFromFriends: boolean;
}) => {
  const { userIds, sectorId, hideFromFriends } = payload;
  try {
    const response = await API.post(
      `/habit-stack-components/users/sector/${sectorId}/hideFromFriends/${hideFromFriends}`,
      { userIds }
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("FetchHabitStackComponentsByUserIdsAndSectorIdAndHideFromFriends error:", err);
    return { data: null, status: 500 };
  }
};

/**
 *  Retrieves all HabitStackComponents for the friends of a given user ID
 * @param userId - The ID of the user whose friends' habit stacks are to be fetched
 * @returns The habit stack components for the friends of the specified user
 */
export const APIfetchHabitStacksForFriends = async (userId: string) => {
  const request = `/habit-stacks/friends/${userId}`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("fetchHabitStacksForFriends error:", err);
    return { data: null, status: 500 };
  }
};

export const APIfetchHabitStackComponentsForFriends = async (userId: string) => {
  const request = `/habit-stack-components/friends/${userId}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("fetchHabitStackComponentsForFriends error:", err);
    return { data: null, status: 500 };
  }
};

export const CopyHabitStackToAnotherUser = async (payload: any) => {
  const request = `/habit-stack-data-migration/copy-to-new-user`;
  try {
    const response = await API.post(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("CopyHabitStackToAnotherUser error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const GetHabitStackByDocumentId = async (payload: any) => {
  const request = `/habit-stacks/by-docId/${payload.id}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("GetHabitStackByDocumentId error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export interface GetHabitStackComponentsComplexV1Params {
  isPublic?: boolean;
  hideFromFriends?: boolean;
  pageSize: number;
  pageNumber: number;
  searchName?: string;
  sectorIds?: string;
  habitStackIds?: string;
  userIdsToInclude?: string;
  userIdsToIgnore?: string;
}

export const GetHabitStackComponentsComplexV1 = async (
  params: GetHabitStackComponentsComplexV1Params
) => {
  try {
    const response = await API.get(
      `/habit-stack-components/paginated/complex-v1`,
      { params }
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetHabitStackComponentsComplexV1 error:", err);
    return { data: null, status: 500 };
  }
};

export interface FetchHabitStacksByNameLikeParams {
  name: string;
  isPublic?: boolean;
  hideFromFriends?: boolean;
  pageSize?: number;
  pageNumber?: number;
  userIdsToIgnore?: string;
}

export const FetchHabitStacksByNameLikeWithVisibility = async (
  params: FetchHabitStacksByNameLikeParams
) => {
  try {
    const response = await API.get(
      `/habit-stacks/paginated/by-name-like-with-visibility`,
      { params }
    );
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("FetchHabitStacksByNameLikeWithVisibility error:", err);
    return { data: null, status: 500 };
  }
};

export const CreateHabitStackLike = async (payload: any) => {
  const request = `/habit-stack-likes`;
  try {
    const response = await API.post(request, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("CreateHabitStackLike error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteHabitStackLike = async (docId: string) => {
  const request = `/habit-stack-likes/${docId}`;
  try {
    const response = await API.delete(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("DeleteHabitStackLike error:", err);
    return { data: null, status: 500 };
  }
};

export const CreateHabitStackRating = async (payload: any) => {
  try {
    const response = await API.post(`/habit-stack-ratings`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("CreateHabitStackRating error:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateHabitStackRating = async (docId: string, payload: any) => {
  try {
    const response = await API.put(`/habit-stack-ratings/${docId}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("UpdateHabitStackRating error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteHabitStackRating = async (docId: string) => {
  try {
    const response = await API.delete(`/habit-stack-ratings/${docId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DeleteHabitStackRating error:", err);
    return { data: null, status: 500 };
  }
};