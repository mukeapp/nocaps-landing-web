import {
  GetAllColors,
  GetAllIcons,
  SaveHabitLinks,
  UpdateHabitLinks,
  GetDataHabitLinkByUserIDScreen,
  GetDataHabitLinkItemsScreen,
  DeleteHabitLinkItem,
  SaveHabitLinkItemLikes,
  updateHabitLinkItemLikes,
  GetHabitLinksByHabitId,
  GetHabitLinksComponentsByHabitId,
  CopyHabitLinkToAnotherUser,
} from "@/core/api/section-b";
import { HabitLinkComponent, HabitLinkItemLikes } from "@/core/models/section-b";

export const apiGetColors = async () => (await GetAllColors()).data || [];
export const apiGetIcons = async () => (await GetAllIcons()).data || [];

export const apiSaveHabitLink = async (data: HabitLinkComponent) =>
  (await SaveHabitLinks({ data })).data;

export const apiUpdateHabitLink = async (docid: string, data: HabitLinkComponent) =>
  (await UpdateHabitLinks({ data, docid })).data;

export const apiGetHabitLinkGroupsForUser = async (userId: string) => {
  const res = await GetDataHabitLinkByUserIDScreen({ userId });
  return res?.data || [];
};

// items for a given habit link (group)
export const apiGetItemsForHabitLink = async (docid: string) => {
  const res = await GetDataHabitLinkItemsScreen({ docid });
  return res?.data || {};
};

export const apiDeleteHabitLinkItem = async (id: string) => {
  const res = await DeleteHabitLinkItem({ id });
  return res?.data;
};

// SaveHabitLinkItemLikes
export const apiSaveHabitLinkItemLikes = async (data: HabitLinkItemLikes) =>
  (await SaveHabitLinkItemLikes({ data })).data;

//   updateHabitLinkItemLikes
export const apiUpdateHabitLinkItemLikes = async (docid: string, data: HabitLinkItemLikes) =>
  (await updateHabitLinkItemLikes({ data, docid })).data;

//GetHabitLinksByHabitId
export const apiGetHabitLinksByHabitId = async (habitId: string) => {
  const res = await GetHabitLinksByHabitId({ habitId });
  return res?.data || [];
};

// GetHabitLinksComponentsByHabitId
export const apiGetHabitLinksComponentsByHabitId = async (habitId: string) => {
  const res = await GetHabitLinksComponentsByHabitId({ habitId });
  return res?.data || [];
};

export const dataMigrationCopyHabitLinkToAnotherUser = async (data: any) => {
  const res = await CopyHabitLinkToAnotherUser({ data  });
  return res?.data || null;
}