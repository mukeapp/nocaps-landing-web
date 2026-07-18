import { API } from "@/core/clients/axios";
import { AxiosError } from "axios";

// Generic error handler
export const handleApiError = (err: unknown, context: string) => {
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
export const apiRequest = async (
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