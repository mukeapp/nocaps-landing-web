import { API } from "@/core/clients/axios";
import { AxiosError } from "axios";

// Generic error handler
const handleApiError = (err: unknown, context: string) => {
  if (err instanceof AxiosError) {
    const status = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.message;

    console.error(`Error ${context}:`, {
      status,
      message: errorMessage,
      data: err.response?.data,
    });

    return {
      data: null,
      status,
      error: errorMessage,
      success: false,
    };
  }

  // Handle non-Axios errors
  console.error(`Unexpected error ${context}:`, err);
  return {
    data: null,
    status: 500,
    error: "An unexpected error occurred",
    success: false,
  };
};

// Generic API request handler - just throws errors, doesn't catch them
const apiRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  payload?: any,
  context?: string
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response;
  switch (method) {
    case "get":
      response = await API.get(url, config);
      break;
    case "post":
      response = await API.post(url, payload, config);
      break;
    case "put":
      response = await API.put(url, payload, config);
      break;
    case "delete":
      response = await API.delete(url, config);
      break;
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }

  const { data, status } = response;
  return { data, status, success: true };
};

// Create habit link item data
export const createHabitLinkItemData = async (payload: any) => {
  try {
    const request = `/habit-link-items-data`;
    return await apiRequest("post", request, payload.data, "saving habit link item");
  } catch (err) {
    return handleApiError(err, "createHabitLinkItemData");
  }
};

// Update habit link item data
export const updateHabitLinkItemData = async (payload: any) => {
  try {
    const { id } = payload;
    const request = `/habit-link-items-data/${id}`;
    return await apiRequest("put", request, payload.data, "updating habit link item");
  } catch (err) {
    return handleApiError(err, "updateHabitLinkItemData");
  }
};

// Get habit link item data by originId, habitLinkId and date
export const fetchHabitLinkItemDataByOriginIdAndHabitLinkIdAndDate = async (payload: any) => {
  try {
    const { originId, habitLinkId, year, month, day } = payload;
    const request = `/habit-link-items-data/by-originId/${originId}/by-habitLinkId/${habitLinkId}/by-date?year=${year}&month=${month}&day=${day}`;
    console.log("GET Request:", request);
    return await apiRequest("get", request, undefined, "fetching habit link item data");
  } catch (err) {
    return handleApiError(err, "fetchHabitLinkItemDataByOriginIdAndHabitLinkIdAndDate");
  }
};

// Purge habit link item data by id, habitLinkId and date
export const purgeHabitLinkItemDataByIdAndHabitLinkIdAndDate = async (payload: any) => {
  try {
    const { id, habitLinkId, year, month, day } = payload;
    const request = `/habit-link-items-data/by-id/${id}/by-habitLinkId/${habitLinkId}/by-date?year=${year}&month=${month}&day=${day}`;
    console.log("DELETE Request:", request);
    return await apiRequest("delete", request, undefined, "deleting habit link item data by id");
  } catch (err) {
    return handleApiError(err, "purgeHabitLinkItemDataByIdAndHabitLinkIdAndDate");
  }
};

// Get all habit link item data by habitStackId and date
export const fetchHabitLinkItemDataByHabitStackIdAndDate = async (payload: {
  habitStackId: string;
  year: number;
  month: number;
  day: number;
}) => {
  try {
    const {habitStackId, year, month, day} = payload;
    const request = `/habit-link-items-data/by-habitStackId/${habitStackId}/by-date?year=${year}&month=${month}&day=${day}`;
    return await apiRequest("get", request, undefined, "fetching habit link item data by habitStackId and date");
  } catch (err) {
    return handleApiError(err, "fetchHabitLinkItemDataByHabitStackIdAndDate");
  }
};

// Get all habit link item data by originId and dateNoCap
export const fetchHabitLinkItemDataByOriginIdAndDateNoCap = async (payload: {
  userId: string;
  originId: string;
  year: number;
  month: number;
  day: number;
  limit?: number;
}) => {
  try {
    const {userId, originId, year, month, day, limit} = payload;
    const limitParam = limit !== undefined ? `&limit=${limit}` : "";
    const request = `/habit-link-items-data/calendar-dates-info/by-user/${userId}/by-originId/${originId}/by-dateNoCap?year=${year}&month=${month}&day=${day}${limitParam}`;
    return await apiRequest("get", request, undefined, "fetching habit link item data by originId and dateNoCap");
  } catch (err) {
    return handleApiError(err, "fetchHabitLinkItemDataByOriginIdAndDateNoCap");
  }
};

// Get all habit link item data by habitLinkItemConstantId and date
export const fetchHabitLinkItemDataByHabitLinkItemConstantIdAndDate = async (payload: {
  habitLinkItemConstantId: string;
  year: number;
  month: number;
  day: number;
}) => {
  try {
    const {habitLinkItemConstantId, year, month, day} = payload;
    const request = `/habit-link-items-data/by-habitLinkItemConstantId/${habitLinkItemConstantId}/by-date?year=${year}&month=${month}&day=${day}`;
    return await apiRequest("get", request, undefined, "fetching habit link item data by habitLinkItemConstantId and date");
  } catch (err) {
    return handleApiError(err, "fetchHabitLinkItemDataByHabitLinkItemConstantIdAndDate");
  }
};

// Get all habit link item data by habitId and date
export const fetchHabitLinkItemDataByHabitIdAndDate = async (payload: {
  habitId: string;
  year: number;
  month: number;
  day: number;
}) => {
  try {
    const {habitId, year, month, day} = payload;
    const request = `/habit-link-items-data/by-habitId/${habitId}/by-date?year=${year}&month=${month}&day=${day}`;
    return await apiRequest("get", request, undefined, "fetching habit link item data by habitId and date");
  } catch (err) {
    return handleApiError(err, "fetchHabitLinkItemDataByHabitIdAndDate");
  }
};

// Get all habit link item data by habitLinkId and date
export const fetchHabitLinkItemDataByHabitLinkIdAndDate = async (payload: any) => {
  try {
    const { habitLinkId, year, month, day } = payload;
    const request = `/habit-link-items-data/by-habitLinkId/${habitLinkId}/by-date?year=${year}&month=${month}&day=${day}`;
    return await apiRequest("get", request, undefined, "fetching habit link item data by habitLinkId and date");
  } catch (err) {
    return handleApiError(err, "fetchHabitLinkItemDataByHabitLinkIdAndDate");
  }
};

// Purge habit link item data by originId, habitLinkId and date
export const purgeHabitLinkItemDataByOriginIdAndHabitLinkIdAndDate = async (payload: any) => {
  try {
    const { originId, habitLinkId, year, month, day } = payload;
    const request = `/habit-link-items-data/by-originId/${originId}/by-habitLinkId/${habitLinkId}/by-date?year=${year}&month=${month}&day=${day}`;
    console.log("DELETE Request:", request);
    return await apiRequest("delete", request, undefined, "deleting habit link item data by originId");
  } catch (err) {
    return handleApiError(err, "purgeHabitLinkItemDataByOriginIdAndHabitLinkIdAndDate");
  }
};