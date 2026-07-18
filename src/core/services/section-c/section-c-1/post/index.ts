import { CreateNocapPost, DeleteNocapPostDataPurge, GetNocapPostsPaginated, GetNocapPostComponentsPaginated, GetNocapPostComponentsBySectorIdsThenUserIdsPaginated } from "@/core/api/section-c";
import { GetNocapPostsByVisibilityAndUserIds, GetNocapPostComponentsByVisibilityAndUserIds, GetNocapPostComponentByDocumentId, GetNocapPostComponentsByAllFiltersPaginated } from "@/core/api/section-c/section-c-1/post";
import { NocapPost } from "@/core/models/section-c";

export const createNocapPost = async (data: any) =>
  CreateNocapPost({ data });

export const deleteNocapPostDataPurge = async (postId: string) => {
  const result = await DeleteNocapPostDataPurge(postId);
  return result;
};

export const fetchNocapPostsPaginated = async (params: {
  pageNumber: number;
  pageSize: number;
  postVisibility: number;
}): Promise<{ items: NocapPost[]; hasMore: boolean }> => {
  const result = await GetNocapPostsPaginated(params);
  const res = result.data;

  const raw =
    res?.items ??
    res?.nocapPosts ??
    res?.data ??
    (Array.isArray(res) ? res : []);

  const items: NocapPost[] = Array.isArray(raw) ? raw : [];
  const totalPages = res?.numberOfPages ?? 0;
  const hasMore = params.pageNumber < totalPages;
  return { items, hasMore };
};


export const getNocapPostComponentsBySectorIdsThenUserIdsPaginated = async (params: {
  pageNumber: number;
  pageSize: number;
  sectorIds: string;
  userIds: string;
}): Promise<{ items: any[]; hasMore: boolean }> => {
  const result = await GetNocapPostComponentsBySectorIdsThenUserIdsPaginated(params);
  const res = result.data;

  const raw =
    res?.items ??
    res?.nocapPosts ??
    res?.data ??
    (Array.isArray(res) ? res : []);

  const items: any[] = Array.isArray(raw) ? raw : [];
  const totalPages = res?.numberOfPages ?? 0;
  const hasMore = params.pageNumber < totalPages;
  return { items, hasMore };
};

export const fetchNocapPostsByVisibilityAndUserIds = async (params: {
  pageNumber: number;
  pageSize: number;
  postVisibility: number;
  userIds: string;
}): Promise<{ items: NocapPost[]; hasMore: boolean }> => {
  const result = await GetNocapPostsByVisibilityAndUserIds(params);
  const res = result.data;
  const raw =
    res?.items ??
    res?.nocapPosts ??
    res?.data ??
    (Array.isArray(res) ? res : []);
  const items: NocapPost[] = Array.isArray(raw) ? raw : [];
  const totalPages = res?.numberOfPages ?? 0;
  const hasMore = params.pageNumber < totalPages;
  return { items, hasMore };
};

export const fetchNocapPostComponentsByVisibilityAndUserIds = async (params: {
  pageNumber: number;
  pageSize: number;
  postVisibility: number;
  userIds: string;
}): Promise<{ items: any[]; hasMore: boolean }> => {
  const result = await GetNocapPostComponentsByVisibilityAndUserIds(params);
  const res = result.data;
  const raw = res?.items ?? res?.nocapPosts ?? res?.data ?? (Array.isArray(res) ? res : []);
  const items: any[] = Array.isArray(raw) ? raw : [];
  const totalPages = res?.numberOfPages ?? 0;
  const hasMore = params.pageNumber < totalPages;
  return { items, hasMore };
};

export const getNocapPostComponentsByAllFiltersPaginated = async (params: {
  pageNumber: number;
  pageSize: number;
  sectorIds: string;
  userIds: string;
  habitStackIds: string;
}): Promise<{ items: any[]; hasMore: boolean }> => {
  const result = await GetNocapPostComponentsByAllFiltersPaginated(params);
  const res = result.data;
  const raw =
    res?.items ?? res?.nocapPosts ?? res?.data ?? (Array.isArray(res) ? res : []);
  const items: any[] = Array.isArray(raw) ? raw : [];
  const totalPages = res?.numberOfPages ?? 0;
  const hasMore = params.pageNumber < totalPages;
  return { items, hasMore };
};

export const fetchNocapPostComponentByDocumentId = async (postId: string) => {
  const result = await GetNocapPostComponentByDocumentId(postId);
  return result?.data ?? null;
};

// fetchNocapPostsComponentsPaginated

export const fetchNocapPostComponentsPaginated = async (params: {
  pageNumber: number;
  pageSize: number;
  postVisibility: number;
}): Promise<{ items: any[]; hasMore: boolean }> => {
  const result = await GetNocapPostComponentsPaginated(params);
  const res = result.data;

  const raw =
    res?.items ??
    res?.nocapPosts ??
    res?.data ??
    (Array.isArray(res) ? res : []);

  const items: any[] = Array.isArray(raw) ? raw : [];
  const totalPages = res?.numberOfPages ?? 0;
  const hasMore = params.pageNumber < totalPages;
  return { items, hasMore };
};