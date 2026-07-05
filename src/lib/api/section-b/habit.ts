import { API } from "@/lib/api/client";

// Ported from mobile core/api/section-b/section-b-0/habit/index.ts.

export const GetHabitComponentsByHabitStackId = async (payload: { id: string }) => {
  try {
    const response = await API.get(`/habit-components/habit-stack/${payload.id}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetHabitComponentsByHabitStackId error:", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitByDocumentId = async (payload: { id: string }) => {
  try {
    const response = await API.get(`/habits/by-docId/${payload.id}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetHabitByDocumentId error:", err);
    return { data: null, status: 500 };
  }
};

export const SaveHabitRequest = async (payload: { data: any }) => {
  try {
    const response = await API.post(`/habits`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("SaveHabitRequest error:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateHabitRequest = async (payload: { data: any }) => {
  try {
    const response = await API.put(`/habits/${payload.data.id}`, payload.data);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("UpdateHabitRequest error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteHabitOnly = async (payload: { id: string }) => {
  try {
    const response = await API.delete(`/habit-data-etl/purge-habit-data/${payload.id}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DeleteHabitOnly error:", err);
    return { data: null, status: 500 };
  }
};

export const GetAllDays = async () => {
  try {
    const response = await API.get(`/days`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetAllDays error:", err);
    return { data: null, status: 500 };
  }
};

export const GetAllFrequencies = async () => {
  try {
    const response = await API.get(`/frequencies`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetAllFrequencies error:", err);
    return { data: null, status: 500 };
  }
};
