import {
  GetNocapPostCommentComponentsByPostId,
  CreateNocapPostComment,
  DeleteNocapPostCommentDataPurge,
  CreateNocapPostCommentLike,
  DeleteNocapPostCommentLike,
  DeleteNocapPostCommentLikeByIdAndUserId,
  PatchNocapPostComment,
} from "@/core/api/section-c";
import { NocapPostCommentComponent } from "@/core/models/section-c";

export const fetchNocapPostCommentComponentsByPostId = async (
  nocapPostId: string
): Promise<NocapPostCommentComponent[]> => {
  const result = await GetNocapPostCommentComponentsByPostId(nocapPostId);
  const res = result.data;
  const raw =
    res?.items ??
    res?.nocapPostComments ??
    res?.data ??
    (Array.isArray(res) ? res : []);
  return Array.isArray(raw) ? raw : [];
};

export const createNocapPostComment = async (payload: {
  id: string;
  userId: string;
  nocapPostId: string;
  parentNocapPostCommentId?: string;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}) => {
  return CreateNocapPostComment(payload);
};

export const deleteNocapPostCommentPurge = async (commentId: string) => {
  return DeleteNocapPostCommentDataPurge(commentId);
};

export const createNocapPostCommentLike = async (payload: {
  id: string;
  userId: string;
  nocapPostCommentId: string;
  isLike: boolean;
  createdAt: string;
  updatedAt: string;
}) => {
  return CreateNocapPostCommentLike(payload);
};

export const deleteNocapPostCommentLike = async (docId: string) => {
  return DeleteNocapPostCommentLike(docId);
};

export const deleteNocapPostCommentLikeByIdAndUserId = async (docId: string, userId: string) => {
  return DeleteNocapPostCommentLikeByIdAndUserId(docId, userId);
};

export const updateNocapPostComment = async (commentId: string, payload: {
  content: string;
  //updatedAt: string;
}) => {
  return PatchNocapPostComment(commentId, payload);
};

