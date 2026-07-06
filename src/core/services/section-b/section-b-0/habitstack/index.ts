import {
  GetAllColors,
  GetAllIcons,
  GetAllSectorComponents,
  GetAllSectorsFullComponent,
  UpdateHabitStack,
  SaveHabitStack,
  GetSectorById,
  DeleteHabitOnly,
  fetchHabitStackComponentsBySectorId,
  fetchHabitStackComponentsByUserAndSector,
  FetchHabitStackComponentsByUserIdsAndSectorId,
  FetchHabitStackComponentsByUserIdsAndSectorIdAndHideFromFriends,
  CopyHabitStackToAnotherUser,
  CopyHabitToAnotherUser,
  APIfetchHabitStackComponentsForFriends,
  APIfetchHabitStacksForFriends,
  GetHabitStackByDocumentId,
  FetchHabitStacksByNameLikeWithVisibility,
  GetHabitStackComponentsComplexV1,
} from "@/core/api/section-b";
import { HabitStackComponentPagination } from "@/core/models/section-b";
import {HabitStackComponent} from "@/core/models/section-b/habit";

export const fetchSectorOptions = async () =>
  (await GetAllSectorComponents()).data;
export const fetchIcons = async () => (await GetAllIcons()).data;
export const fetchColors = async () => (await GetAllColors()).data;

export const fetchSectorFull = async (doc: string) =>
  (await GetAllSectorsFullComponent({ doc })).data;

export const fetchSectorById = async (id: string) =>
  (await GetSectorById({ id })).data;

export const saveHabitStack = async (data: any) => SaveHabitStack({ data });
export const updateHabitStack = async (data: any) => UpdateHabitStack({ data });
export const deleteHabitOnly = async (id: string) => DeleteHabitOnly({ id });

export const getHabitStackComponentsBySectorId = async (sectorId: string) =>
  (await fetchHabitStackComponentsBySectorId(sectorId)).data;

export const getHabitStackComponentsByUserAndSector = async (
  userId: string,
  sectorId: string
) => (await fetchHabitStackComponentsByUserAndSector(userId, sectorId)).data;

export const getHabitStackComponentsByUserIdsAndSector = async (
  userIds: string[],
  sectorId: string
) =>
  (await FetchHabitStackComponentsByUserIdsAndSectorId({ userIds, sectorId }))
    .data;

export const getHabitStackComponentsByUserIdsAndSectorAndHideFromFriends = async (
  userIds: string[],
  sectorId: string,
  hideFromFriends: boolean = false
) =>
  (
    await FetchHabitStackComponentsByUserIdsAndSectorIdAndHideFromFriends({
      userIds,
      sectorId,
      hideFromFriends,
    })
  ).data;

export const getHabitStackComponentsForFriends = async (userId: string) =>
  (await APIfetchHabitStackComponentsForFriends(userId)).data;

export const getHabitStacksForFriends = async (userId: string) =>
  (await APIfetchHabitStacksForFriends(userId)).data;

export const dataMigrationCopyHabitStackToAnotherUser = async (data: any) => {
  return await CopyHabitStackToAnotherUser({ data  });
};

// GetHabitStackByDocumentId
export const fetchHabitStackByDocumentId = async (id: string) => {
  const res = await GetHabitStackByDocumentId({ id });
  return res?.data;
};

export const fetchHabitStackByDocumentIds = async (
  ids: string,
): Promise<HabitStackComponent[]> => {

  if(!ids) return [];

  const idArray = ids.trim()
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  const results = await Promise.all(
    idArray.map((id) => fetchHabitStackByDocumentId(id)),
  );

  // Filter out any nulls/undefined in case some ids didn't resolve
  return results.filter((stack): stack is HabitStackComponent => stack != null);
};

export const fetchHabitStacksByNameLike = async (params: {
  name: string;
  isPublic?: boolean;
  hideFromFriends?: boolean;
  pageSize?: number;
  pageNumber?: number;
  userIdsToIgnore?: string;
}): Promise<any[]> => {
  const res = await FetchHabitStacksByNameLikeWithVisibility(params);
  console.log('[fetchHabitStacksByNameLike] raw data:', JSON.stringify(res?.data)?.slice(0, 800));
  const raw =
    res?.data?.habitStacks ??
    res?.data?.habitStackComponents ??
    res?.data?.content ??
    res?.data?.data ??
    res?.data?.items ??
    res?.data;
  return Array.isArray(raw) ? raw : [];
};

export const getHabitStackComponentsComplexV1 = async (params: {
  isPublic?: boolean;
  hideFromFriends?: boolean;
  pageSize: number;
  pageNumber: number;
  searchName?: string;
  sectorIds?: string;
  habitStackIds?: string;
  userIdsToInclude?: string;
  userIdsToIgnore?: string;
}): Promise<{ items: HabitStackComponent[]; hasMore: boolean }> => {
  const result = await GetHabitStackComponentsComplexV1(params);
  const res: HabitStackComponentPagination | null = result.data;
  const raw = res?.habitStackComponents ?? [];
  const items: HabitStackComponent[] = Array.isArray(raw) ? raw : [];
  const totalPages = res?.numberOfPages ?? 0;
  const hasMore = params.pageNumber < totalPages;
  return { items, hasMore };
};
