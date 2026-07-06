import {API} from "@/core/clients/axios";

export const GetHabitLinkItemByDocumentId = async (payload: any) => {
  const request = `/habit-link-items/by-docId/${payload.id}`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("GetHabitLinkItemByDocumentId error:", err);
    return { data: null, status: 500 };
  }
};

export const GetUnitByHabitLinkId = async (payload: any) => {
  const request = `/units/by-habitLinkId/${payload.hid}`;
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
    console.error("Error fetching unit by habit link ID:", err);
    return { data: null, status: 500 };
  }
};

export const SaveHabitLinkItem = async (payload: any) => {
  const request = `/habit-link-items`;
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
    console.error("Error saving habit link item:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateHabitLinkItem = async (payload: any) => {
  const id = payload.data.id;
  const request = `/habit-link-items/${id}`;
  console.log(request);
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
    console.error("Error updating habit link item:", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitLinkItemComponentByDocumentId = async (docId: string) => {
  const request = `/habit-link-item-components/${docId}`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.error("GetHabitLinkItemComponentByDocumentId error:", err);
    return { data: null, status: 500 };
  }
};