import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_NOCAP_ADMIN,
});

export const GetAllSubscriptions = async () => {
  const request = `/api/subscriptions/all`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("GetAllSubscriptions:", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitIntelligenceCosts = async () => {
  const request = `/api/habit-intelligence-costs/all`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("GetHabitIntelligenceCosts:", err);
    return { data: null, status: 500 };
  }
};

export const GetAIProviders = async () => {
  const request = `/api/ai-providers/all`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("GetAIProviders:", err);
    return { data: null, status: 500 };
  }
};
