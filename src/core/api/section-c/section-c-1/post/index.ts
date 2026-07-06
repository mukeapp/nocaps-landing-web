import { API } from "@/core/clients/axios";

export const CreateNocapPost = async (payload: any) => {
  const request = `/nocap-posts`;
  try {
    const response = await API.post(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("CreateNocapPost error:", err);
    return { data: null, status: 500 };
  }
};

export const GetNocapPostsPaginated = async (params: {
  pageNumber: number;
  pageSize: number;
  postVisibility: number;
}) => {
  const request = `/nocap-posts/paginated/by-post-visibility?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&postVisibility=${params.postVisibility}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("GetNocapPostsPaginated error:", err);
    return { data: null, status: 500 };
  }
};

// http://localhost:3000/nocap-post-components/paginated/by-post-visibility?pageNumber=1&pageSize=5&postVisibility=0
export const DeleteNocapPostDataPurge = async (postId: string) => {
  const request = `/nocap-post-data-purge/purge/${postId}`;
  try {
    const response = await API.delete(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("DeleteNocapPostDataPurge error:", err);
    return { data: null, status: 500 };
  }
};

export const GetNocapPostComponentsPaginated = async (params: {
  pageNumber: number;
  pageSize: number;
  postVisibility: number;
}) => {
  const request = `/nocap-post-components/paginated/by-post-visibility?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&postVisibility=${params.postVisibility}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("GetNocapPostComponentsPaginated error:", err);
    return { data: null, status: 500 };
  }
};

export const GetNocapPostComponentsBySectorIdsThenUserIdsPaginated = async (params: {
  pageNumber: number;
  pageSize: number;
  sectorIds: string;
  userIds: string;
}) => {
  const request = `/nocap-post-components/paginated/by-sector-ids-then-user-ids?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&sectorIds=${params.sectorIds}&userIds=${params.userIds}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("GetNocapPostComponentsBySectorIdsThenUserIdsPaginated error:", err);
    return { data: null, status: 500 };
  }
};

export const GetNocapPostComponentsByVisibilityAndUserIds = async (params: {
  pageNumber: number;
  pageSize: number;
  postVisibility: number;
  userIds: string;
}) => {
  const request = `/nocap-post-components/paginated/by-post-visibility-and-user-ids?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&postVisibility=${params.postVisibility}&userIds=${params.userIds}`;
  try {
    const response = await API.get(request, { headers: { "Content-Type": "application/json" } });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetNocapPostComponentsByVisibilityAndUserIds error:", err);
    return { data: null, status: 500 };
  }
};

export const GetNocapPostsByVisibilityAndUserIds = async (params: {
  pageNumber: number;
  pageSize: number;
  postVisibility: number;
  userIds: string;
}) => {
  const request = `/nocap-posts/paginated/by-post-visibility-and-user-ids?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&postVisibility=${params.postVisibility}&userIds=${params.userIds}`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetNocapPostsByVisibilityAndUserIds error:", err);
    return { data: null, status: 500 };
  }
};

export const GetNocapPostComponentsByAllFiltersPaginated = async (params: {
  pageNumber: number;
  pageSize: number;
  sectorIds: string;
  userIds: string;
  habitStackIds: string;
}) => {
  const request =
    `/nocap-post-components/paginated/by-sector-ids-then-user-ids-then-habit-stack-id` +
    `?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}` +
    `&sectorIds=${params.sectorIds}&userIds=${params.userIds}` +
    `&habitStackIds=${params.habitStackIds}`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetNocapPostComponentsByAllFiltersPaginated error:", err);
    return { data: null, status: 500 };
  }
};

export const GetNocapPostComponentByDocumentId = async (postId: string) => {
  try {
    const response = await API.get(`/nocap-post-components/${postId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetNocapPostComponentByDocumentId error:", err);
    return { data: null, status: 500 };
  }
};

export const CreateNocapPostLike = async (payload: any) => {
  const request = `/nocap-post-likes`;
  try {
    const response = await API.post(request, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("CreateNocapPostLike error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteNocapPostLike = async (docId: string) => {
  const request = `/nocap-post-likes/${docId}`;
  try {
    const response = await API.delete(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("DeleteNocapPostLike error:", err);
    return { data: null, status: 500 };
  }
};
