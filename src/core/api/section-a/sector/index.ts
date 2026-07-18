import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_NOCAP_API,
});


export const GetAllSector = async () => {
  const request = `/sectors`;
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
    console.log("Error fetching sectors");
    console.log("Error Fetching sectors:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};