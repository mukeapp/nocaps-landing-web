import { API } from "@/lib/api/client";

// Ported from mobile core/api/section-b/section-b-0/habit-stack/index.ts (real, confirmed endpoints).

export const getHabitStackComponentsByUserId = async (payload: { id: string }) => {
  try {
    const response = await API.get(
      `/habit-stack-components/user/${payload.id}?cache_bust=${Date.now()}`,
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("getHabitStackComponentsByUserId error:", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitStackByDocumentId = async (payload: { id: string }) => {
  try {
    const response = await API.get(`/habit-stacks/by-docId/${payload.id}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetHabitStackByDocumentId error:", err);
    return { data: null, status: 500 };
  }
};

export const SaveHabitStack = async (payload: { data: any }) => {
  try {
    const response = await API.post(`/habit-stacks`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("SaveHabitStack error:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateHabitStack = async (payload: { data: any }) => {
  try {
    const response = await API.put(`/habit-stacks/${payload.data.id}`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("UpdateHabitStack error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteHabitStack = async (payload: { id: string }) => {
  try {
    const response = await API.delete(`/habit-stack-data-purge/purge/${payload.id}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DeleteHabitStack error:", err);
    return { data: null, status: 500 };
  }
};

export const fetchHabitStackComponentsByUserAndSector = async (
  userId: string,
  sectorId: string,
) => {
  try {
    const response = await API.get(`/habit-stack-components/user/${userId}/sector/${sectorId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("fetchHabitStackComponentsByUserAndSector error:", err);
    return { data: null, status: 500 };
  }
};

export const CopyHabitStackToAnotherUser = async (payload: { data: any }) => {
  try {
    const response = await API.post(`/habit-stack-data-migration/copy-to-new-user`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("CopyHabitStackToAnotherUser error:", err);
    return { data: null, status: 500 };
  }
};

export const GetAllSectorComponents = async () => {
  try {
    const response = await API.get(`/sector-components`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetAllSectorComponents error:", err);
    return { data: null, status: 500 };
  }
};
