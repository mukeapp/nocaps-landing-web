import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_NOCAP_API,
});

export const GetUserNonFriends = async (payload: any) => {
  const request = `/users-friends/${payload.userId}/non-friends?pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`;
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
    console.log("GetUserNonFriends:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const GetUserFriendsRequests = async (payload: any) => {
  const request = `/users-friends/${payload.userId}/requests?areFriends=false&pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`;
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
    console.log("GetUserFriendsRequests :", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const GetUserAreFriends = async (payload: any) => {
  const request = `/users-friends/${payload.userId}/requests?areFriends=true&pageSize=${payload.pageSize}&pageNumber=${payload.pageNumber}`;
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
    console.log("GetUserFriendsRequests :", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const PatchFriendRequestAreFriends = async (payload: any) => {
  const request = `/friends/${payload.docId}/areFriends/${payload.areFriends}`;
  try {
    const response = await API.patch(request, payload.data, {
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
    console.log("PatchFriendRequestAreFriends error:", err);
    return { data: null, status: 500 };
  }
};

export const SaveFriendRequest = async (payload: any) => {
  const request = `/friends`;
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
    console.log("SaveFriendRequest error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteFriendRequest = async (payload: any) => {
  const request = `/friends/${payload.docId}`;
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
    console.log("deleteFriendRequest error:", err);
    return { data: null, status: 500 };
  }
};
