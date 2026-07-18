import {
  createHabitLinkItemData,
  fetchHabitLinkItemDataByHabitIdAndDate,
  fetchHabitLinkItemDataByHabitLinkIdAndDate,
  fetchHabitLinkItemDataByHabitLinkItemConstantIdAndDate,
  fetchHabitLinkItemDataByHabitStackIdAndDate,
  fetchHabitLinkItemDataByOriginIdAndDateNoCap,
  fetchHabitLinkItemDataByOriginIdAndHabitLinkIdAndDate,
  purgeHabitLinkItemDataByIdAndHabitLinkIdAndDate,
  purgeHabitLinkItemDataByOriginIdAndHabitLinkIdAndDate,
} from "@/core/api/section-b";
import {HabitLinkItemComponent} from "@/core/models/section-b";


export const saveHabitLinkItemData = async (data: HabitLinkItemComponent) => {
  const res = await createHabitLinkItemData({ data });
  return res?.data;
};

export const deleteHabitLinkItemData = async (id: string, habitLinkId: string, year: number, month: number, day: number) => {
  const res = await purgeHabitLinkItemDataByIdAndHabitLinkIdAndDate({ id, habitLinkId, year, month, day });
  return res?.data;
};

export const deleteHabitLinkItemDataByOriginIdAndDate = async (originId: string, habitLinkId: string, year: number, month: number, day: number) => {
  const res = await purgeHabitLinkItemDataByOriginIdAndHabitLinkIdAndDate({ originId, habitLinkId, year, month, day });
  return res?.data;
};

export const getHabitLinkItemDataByOriginIdAndDate = async (originId: string, habitLinkId: string, year: number, month: number, day: number) => {
  const res = await fetchHabitLinkItemDataByOriginIdAndHabitLinkIdAndDate({ originId, habitLinkId, year, month, day });
  return res?.data;
};

export const getHabitLinkItemDataByHabitLinkIdAndDate = async (
  habitLinkId: string,
  year: number,
  month: number,
  day: number,
): Promise<HabitLinkItemComponent[]> => {
  const res = await fetchHabitLinkItemDataByHabitLinkIdAndDate({ habitLinkId, year, month, day });
  return res?.data ?? [];
};

export const getHabitLinkItemDataByOriginIdAndDateNoCap = async (
  userId: string,
  originId: string,
  year: number,
  month: number,
  day: number,
  limit?: number,
): Promise<HabitLinkItemComponent[]> => {
  const res = await fetchHabitLinkItemDataByOriginIdAndDateNoCap({userId, originId, year, month, day, limit});
  return res?.data ?? [];
};

export const getHabitLinkItemDataByHabitLinkItemConstantIdAndDate = async (
  habitLinkItemConstantId: string,
  year: number,
  month: number,
  day: number,
): Promise<HabitLinkItemComponent[]> => {
  const res = await fetchHabitLinkItemDataByHabitLinkItemConstantIdAndDate({habitLinkItemConstantId, year, month, day});
  return res?.data ?? [];
};

export const getHabitLinkItemDataByHabitStackIdAndDate = async (
  habitStackId: string,
  year: number,
  month: number,
  day: number,
): Promise<HabitLinkItemComponent[]> => {
  const res = await fetchHabitLinkItemDataByHabitStackIdAndDate({habitStackId, year, month, day});
  return res?.data ?? [];
};

export const getHabitLinkItemDataByHabitIdAndDate = async (
  habitId: string,
  year: number,
  month: number,
  day: number,
): Promise<HabitLinkItemComponent[]> => {
  const res = await fetchHabitLinkItemDataByHabitIdAndDate({habitId, year, month, day});
  return res?.data ?? [];
};