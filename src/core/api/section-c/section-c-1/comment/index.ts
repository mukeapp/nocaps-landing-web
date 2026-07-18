import { API } from "@/core/clients/axios";

export const GetNocapPostCommentComponentsByPostId = async (nocapPostId: string) => {
  const request = `/nocap-post-comment-components/by-nocapPostId/${nocapPostId}`;
  try {
    const response = await API.get(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("GetNocapPostCommentComponentsByPostId error:", err);
    return { data: null, status: 500 };
  }
};

export const CreateNocapPostComment = async (payload: any) => {
  const request = `/nocap-post-comments`;
  try {
    const response = await API.post(request, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("CreateNocapPostComment error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteNocapPostCommentDataPurge = async (commentId: string) => {
  const request = `/nocap-post-comment-data-purge/purge/${commentId}`;
  try {
    const response = await API.delete(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("DeleteNocapPostCommentDataPurge error:", err);
    return { data: null, status: 500 };
  }
};

export const CreateNocapPostCommentLike = async (payload: any) => {
  const request = `/nocap-post-comment-likes`;
  try {
    const response = await API.post(request, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("CreateNocapPostCommentLike error:", err);
    return { data: null, status: 500 };
  }
};

export const DeleteNocapPostCommentLike = async (docId: string) => {
  const request = `/nocap-post-comment-likes/${docId}`;
  try {
    const response = await API.delete(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("DeleteNocapPostCommentLike error:", err);
    return { data: null, status: 500 };
  }
};

// DELETE
//nocap-post-comment-likes/by-nocapPostCommentId/{nocapPostCommentId}/by-userId/{userId}
export const DeleteNocapPostCommentLikeByIdAndUserId = async (docId: string, userId: string) => {
  const request = `/nocap-post-comment-likes/by-nocapPostCommentId/${docId}/by-userId/${userId}`;
  try {
    const response = await API.delete(request, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("DeleteNocapPostCommentLikeByIdAndUserId error:", err);
    return { data: null, status: 500 };
  }
};

export const PatchNocapPostComment = async (commentId: string, payload: { content: string }) => {
  const request = `/nocap-post-comments/${commentId}/content`;
  try {
    const response = await API.patch(request, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const { data, status } = response;
    return { data, status };
  } catch (err) {
    console.log("PatchNocapPostComment error:", err);
    return { data: null, status: 500 };
  }
};
