import { API } from "@/lib/api/client";

// Ported from mobile core/api/section-b/section-b-1/index.ts (friends graph)
// plus the friends-stacks endpoint from section-b-0/habit-stack.

export const GetUserNonFriends = async (payload: {
  userId: string;
  pageSize: number;
  pageNumber: number;
}) => {
  try {
    const response = await API.get(
      `/users-friends/${payload.userId}/non-friends?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetUserNonFriends error:", err);
    return { data: null, status: 500 };
  }
};

export const GetUserFriendsRequests = async (payload: {
  userId: string;
  pageSize: number;
  pageNumber: number;
}) => {
  try {
    const response = await API.get(
      `/users-friends/${payload.userId}/requests?areFriends=false&pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetUserFriendsRequests error:", err);
    return { data: null, status: 500 };
  }
};

export const GetUserAreFriends = async (payload: {
  userId: string;
  pageSize: number;
  pageNumber: number;
}) => {
  try {
    const response = await API.get(
      `/users-friends/${payload.userId}/requests?areFriends=true&pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`,
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetUserAreFriends error:", err);
    return { data: null, status: 500 };
  }
};

/** Mirrors mobile's createFriendRequest service payload exactly. */
export const SaveFriendRequest = async (payload: { userId: string; friendUserId: string }) => {
  try {
    const response = await API.post(`/friends`, {
      id: crypto.randomUUID(),
      userId: payload.userId,
      friendUserId: payload.friendUserId,
      areFriend: false,
      friendRequestStatus: "pending",
      isSender: true,
      isReceiver: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("SaveFriendRequest error:", err);
    return { data: null, status: 500 };
  }
};

export const PatchFriendRequestAreFriends = async (payload: {
  docId: string;
  areFriends: boolean;
}) => {
  try {
    const response = await API.patch(
      `/friends/${payload.docId}/areFriends/${payload.areFriends}`,
      {},
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("PatchFriendRequestAreFriends error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteFriendRequest = async (payload: { docId: string }) => {
  try {
    const response = await API.delete(`/friends/${payload.docId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DeleteFriendRequest error:", err);
    return { data: null, status: 500 };
  }
};

/** Friends' stacks per sector, respecting hideFromFriends (mobile section-b-0). */
export const FetchHabitStackComponentsByUserIdsAndSectorIdAndHideFromFriends = async (payload: {
  userIds: string[];
  sectorId: string;
  hideFromFriends: boolean;
}) => {
  try {
    const response = await API.post(
      `/habit-stack-components/users/sector/${payload.sectorId}/hideFromFriends/${payload.hideFromFriends}`,
      { userIds: payload.userIds },
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("FetchHabitStackComponentsByUserIdsAndSectorIdAndHideFromFriends error:", err);
    return { data: null, status: 500 };
  }
};
