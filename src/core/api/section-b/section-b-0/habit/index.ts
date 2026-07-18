import {API} from "@/core/clients/axios";

export const CreateHabitRating = async (payload: any) => {
  try {
    const response = await API.post(`/habit-ratings`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("CreateHabitRating error:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateHabitRating = async (docId: string, payload: any) => {
  try {
    const response = await API.put(`/habit-ratings/${docId}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("UpdateHabitRating error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteHabitRating = async (docId: string) => {
  try {
    const response = await API.delete(`/habit-ratings/${docId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DeleteHabitRating error:", err);
    return { data: null, status: 500 };
  }
};

export const GetAllDays = async () => {
  const request = `/days`;
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
    console.log("GetAllDays error:", err);
    //throw err?.response?.data;
    return { data: null, status: 500 };
  }
};

export const GetAllFrequencies = async () => {
  const request = `/frequencies`;
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
    console.log("GetAllFrequencies error:", err);
    return { data: null, status: 500 };
  }
};

export const GetInterestBySectorComponent = async (payload: any) => {
  const request = `/sectors-full-component/${payload.id}`;
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
    console.log("GetInterestBySectorComponent error:", err);
    return { data: null, status: 500 };
  }
};

export const SaveHabitRequest = async (payload: any) => {
  const request = `/habits`;
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
    console.log("SaveHabitRequest error:", err);
    return { data: null, status: 500 };
  }
};

export const UpdateHabitRequest = async (payload: any) => {
  const request = `/habits/${payload?.data?.id}`;
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
    console.log("UpdateHabitRequest error:", err);
    return { data: null, status: 500 };
  }
};

export const SaveHabitDays = async (payload: any) => {
  const request = `/habit-days`;
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
    return { data: null, status: 500 };
  }
};

export const DeleteAllHabitDaysByHabitId = async (habitId: string) => {
  const request = `/habit-days/habit/${habitId}`;
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
    console.log("DeleteAllHabitDaysByHabitId error:", err);
    return { data: null, status: 500 };
  }
};

export const CopyHabitToAnotherUser = async (payload: any) => {
  const request = `/habit-data-etl/copy-to-new-user`;
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
    console.log("CopyHabitToAnotherUser error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};

export const GetHabitComponentsByHabitStackId = async (payload: any) => {
  const request = `/habit-components/habit-stack/${payload.id}`;
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
    console.log("GetHabitComponentByHabitStackId error:", err);
    return { data: null, status: 500 };
  }
};

// GetHabitComponentByHabitId
export const GetHabitComponentByHabitId = async (payload: any) => {
  const request = `/habit-components/${payload.id}`;
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
    console.log("GetHabitComponentByHabitId error:", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitByDocumentId = async (payload: any) => {
  const request = `/habits/by-docId/${payload.id}`;
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
    console.log("GetHabitByDocumentId error:", err);
    return { data: null, status: 500 };
  }
};
