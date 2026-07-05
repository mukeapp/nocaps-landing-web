import { API } from "@/lib/api/client";

// Ported from mobile core/api/section-c/section-c-1 (posts + comments).

export const GetNocapPostComponentsPaginated = async (params: {
  pageNumber: number;
  pageSize: number;
  postVisibility: number;
}) => {
  try {
    const response = await API.get(
      `/nocap-post-components/paginated/by-post-visibility?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&postVisibility=${params.postVisibility}`,
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetNocapPostComponentsPaginated error:", err);
    return { data: null, status: 500 };
  }
};

export const CreateNocapPost = async (payload: any) => {
  try {
    const response = await API.post(`/nocap-posts`, payload);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("CreateNocapPost error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteNocapPostDataPurge = async (postId: string) => {
  try {
    const response = await API.delete(`/nocap-post-data-purge/purge/${postId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DeleteNocapPostDataPurge error:", err);
    return { data: null, status: 500 };
  }
};

export const CreateNocapPostLike = async (payload: {
  id: string;
  userId: string;
  nocapPostId: string;
}) => {
  try {
    const now = new Date().toISOString();
    const response = await API.post(`/nocap-post-likes`, {
      ...payload,
      isLiked: true,
      createdAt: now,
      updatedAt: now,
    });
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("CreateNocapPostLike error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteNocapPostLike = async (docId: string) => {
  try {
    const response = await API.delete(`/nocap-post-likes/${docId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DeleteNocapPostLike error:", err);
    return { data: null, status: 500 };
  }
};

export const GetNocapPostCommentComponentsByPostId = async (nocapPostId: string) => {
  try {
    const response = await API.get(`/nocap-post-comment-components/by-nocapPostId/${nocapPostId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("GetNocapPostCommentComponentsByPostId error:", err);
    return { data: null, status: 500 };
  }
};

export const CreateNocapPostComment = async (payload: any) => {
  try {
    const response = await API.post(`/nocap-post-comments`, payload);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("CreateNocapPostComment error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteNocapPostCommentDataPurge = async (commentId: string) => {
  try {
    const response = await API.delete(`/nocap-post-comment-data-purge/purge/${commentId}`);
    return { data: response.data, status: response.status };
  } catch (err) {
    console.log("DeleteNocapPostCommentDataPurge error:", err);
    return { data: null, status: 500 };
  }
};
