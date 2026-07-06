import {API} from "@/core/api/base";


export const GetAllIcons = async () => {
  const request = `/icons`;
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
    console.log("GetAllIcons error:", err);
    throw err;
  }
};