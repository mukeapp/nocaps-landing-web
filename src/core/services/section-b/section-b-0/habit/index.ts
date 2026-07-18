import {
    CopyHabitToAnotherUser,
    DeleteAllHabitDaysByHabitId,
    DeleteHabitLinks,
    GetAllColors,
    GetAllDays,
    GetAllFrequencies,
    GetAllIcons,
    GetDataHabitLinkByUserIDScreen,
    GetDataHabitLinkItemsScreen,
    GetHabitByDocumentId,
    GetHabitComponentByHabitId,
    GetHabitComponentsByHabitStackId,
    GetInterestBySectorComponent,
    SaveHabitDays,
    SaveHabitRequest,
    UpdateHabitRequest
} from "@/core/api/section-b";

// Lists
export async function fetchColors() {
  const res = await GetAllColors();
  return res?.data || [];
}
export async function fetchIcons() {
  const res = await GetAllIcons();
  return res?.data || [];
}
export async function fetchDays() {
  const res = await GetAllDays();
  return res?.data || [];
}
export async function fetchFrequencies() {
  const res = await GetAllFrequencies();
  return res?.data || [];
}
export async function fetchInterestsBySector(sectorId: string) {
  const res = await GetInterestBySectorComponent({ id: sectorId });
  return res?.data || {};
}

// Save/Update habit
export async function saveHabit(data: any) {
  return await SaveHabitRequest({ data });
}
export async function updateHabit(data: any) {
  return await UpdateHabitRequest({ data });
}

// Save days
export async function saveHabitDay(data: any) {
  return await SaveHabitDays({ data });
}

// Delete all habit days by habit ID
export async function deleteAllHabitDaysByHabitId(habitId: string) {
  return await DeleteAllHabitDaysByHabitId(habitId);
}

// Habit links for a user (flatten like your previous logic)
export async function loadUserHabitLinks(userId: string) {
  const res = await GetDataHabitLinkByUserIDScreen({ userId });
  const habits = res?.data || [];
  const items: any[] = [];
  for (const h of habits) {
    try {
      const r = await GetDataHabitLinkItemsScreen({ docid: h.documentId });
      if (r?.data && Object.keys(r.data).length !== 0) items.push(r.data);
    } catch {}
  }
  return items;
}

export async function deleteHabitLink(id: string) {
  return await DeleteHabitLinks({ id });
}

export const dataMigrationCopyHabitToAnotherUser = async (data: any) => {
  return await CopyHabitToAnotherUser({ data });
};

export const fetchHabitComponentsByHabitStackId = async (
  habitStackId: string,
) => {
  const res = await GetHabitComponentsByHabitStackId({ id: habitStackId });
  return res?.data || [];
};

// GetHabitComponentByHabitId
export const fetchHabitComponentByHabitId = async (habitId: string) => {
  const res = await GetHabitComponentByHabitId({ id: habitId });
  return res?.data;
};

export const fetchHabitByDocumentId = async (docId: string) => {
  const res = await GetHabitByDocumentId({ id: docId });
  return res?.data;
};
