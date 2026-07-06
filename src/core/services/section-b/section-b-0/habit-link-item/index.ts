import {
  CopyHabitLinkItemToAnotherUser,
  GetHabitLinkItemByDocumentId,
  GetUnitByHabitLinkId,
  SaveHabitLinkItem,
  UpdateHabitLinkItem,
} from "@/core/api/section-b";
import { GetHabitLinkItemComponentByDocumentId } from "@/core/api/section-b/section-b-0/habit-link-item";
import {HabitLinkItemComponent} from "@/core/models/section-b";

export const fetchHabitLinkItemByDocumentId = async (docId: string) => {
  if (!docId) return null;
  const res = await GetHabitLinkItemByDocumentId({ id: docId });
  return res?.data ?? null;
};

export const fetchHabitLinkItemComponentByDocumentId = async (
  docId: string,
): Promise<HabitLinkItemComponent | null> => {
  if (!docId) return null;
  const res = await GetHabitLinkItemComponentByDocumentId(docId);
  return res?.data ?? null;
};

export const apiGetUnitByHabitLinkId = async (hid: string) => {
  const res = await GetUnitByHabitLinkId({ hid });
  // API returns array; we take the first unit object
  return res?.data?.[0] ?? null;
};

export const apiSaveHabitLinkItem = async (data: HabitLinkItemComponent) => {
  const res = await SaveHabitLinkItem({ data });
  return res?.data;
};

export const apiUpdateHabitLinkItem = async (data: HabitLinkItemComponent) => {
  const res = await UpdateHabitLinkItem({ data });
  return res?.data;
};

export const dataMigrationCopyHabitLinkItemToAnotherUser = async (data: any) => {
  const res = await CopyHabitLinkItemToAnotherUser({ data  });
  return res?.data || null;
}
