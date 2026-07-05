import axios from "axios";

// Mirrors mobile core/api/section-b/section-b-4/index.ts — a separate admin/catalog
// service (different base URL) from the main NoCap API, used to populate the
// subscription-plan, ai-models-cost-multiplier and habit-intelligence-cost slices.
const AdminAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_NOCAP_ADMIN,
});

export const GetAllSubscriptions = async () => {
  try {
    const response = await AdminAPI.get(`/api/subscriptions/all`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetAllSubscriptions error:", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitIntelligenceCosts = async () => {
  try {
    const response = await AdminAPI.get(`/api/habit-intelligence-costs/all`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetHabitIntelligenceCosts error:", err);
    return { data: null, status: 500 };
  }
};

export const GetAIProviders = async () => {
  try {
    const response = await AdminAPI.get(`/api/ai-providers/all`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetAIProviders error:", err);
    return { data: null, status: 500 };
  }
};
