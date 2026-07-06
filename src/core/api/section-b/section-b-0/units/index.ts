import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_NOCAP_API,
});


export const GetUnitsByDocumentId = async (payload: any) => {
  const request = `/units/by-value/${payload?.id}`;
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
    console.log("GetUnitsByValue error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};