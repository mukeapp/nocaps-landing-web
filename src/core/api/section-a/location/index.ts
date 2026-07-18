import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_NOCAP_API,
});


export const SaveUserLocationFirestore = async (payload: any) => {
  // console.log(payload.pull_data);
  const request = `/user-locations`;
  try {
    const response = await API.post(request, payload.pull_data, {
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
    console.log("Error saving user location");
    console.log("Error Saving user location:", err);
    //throw err;
    return { data: null, status: 500 };
  }
};