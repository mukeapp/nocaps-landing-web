import { API } from "@/lib/api/client";

// Ported from mobile core/api/section-b/section-b-0/habit-link/index.tsx.

export const SaveHabitLinks = async (payload: { data: any }) => {
  try {
    const response = await API.post(`/habit-links`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("SaveHabitLinks error:", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitLinksByHabitId = async (payload: { habitId: string }) => {
  try {
    const response = await API.get(`/habit-links/by-habitId/${payload.habitId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("GetHabitLinksByHabitId error:", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitLinksComponentsByHabitId = async (payload: { habitId: string }) => {
  try {
    const response = await API.get(`/habit-link-components/by-habitId/array/${payload.habitId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("GetHabitLinksComponentsByHabitId error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteHabitLinks = async (payload: { id: string }) => {
  try {
    const response = await API.delete(`/habitLink-data-etl/purge-habit-link-data/${payload.id}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("DeleteHabitLinks error:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateHabitLinks = async (payload: { docid: string; data: any }) => {
  try {
    const response = await API.put(`/habit-links/${payload.docid}`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("UpdateHabitLinks error:", err);
    return { data: null, status: 500 };
  }
};
