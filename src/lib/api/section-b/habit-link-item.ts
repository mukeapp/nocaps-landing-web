import { API } from "@/lib/api/client";

// Ported from mobile core/api/section-b/section-b-0/habit-link-item/index.ts
// and the item-listing endpoint from habit-link/index.tsx.

export const GetDataHabitLinkItemsScreen = async (payload: { docid: string }) => {
  try {
    const response = await API.get(`/habit-link-components/by-habitLinkId/${payload.docid}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("GetDataHabitLinkItemsScreen error:", err);
    return { data: null, status: 500 };
  }
};

export const SaveHabitLinkItem = async (payload: { data: any }) => {
  try {
    const response = await API.post(`/habit-link-items`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("SaveHabitLinkItem error:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateHabitLinkItem = async (payload: { data: any }) => {
  try {
    const response = await API.put(`/habit-link-items/${payload.data.id}`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("UpdateHabitLinkItem error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteHabitLinkItem = async (payload: { id: string }) => {
  try {
    const response = await API.delete(`/habit-link-items/${payload.id}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("DeleteHabitLinkItem error:", err);
    return { data: null, status: 500 };
  }
};
