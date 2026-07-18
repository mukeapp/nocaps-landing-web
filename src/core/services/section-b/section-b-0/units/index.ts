import {GetUnitsByDocumentId} from "@/core/api/section-b";
import {fetchHabitByDocumentId} from "../habit";
import {apiGetUnitByHabitLinkId, fetchHabitLinkItemByDocumentId} from "../habit-link-item";
import {fetchHabitStackByDocumentId} from "../habitstack";

export const fetchUnitsByDocumentId = async (documentId: string) => {
    // if documentId is empty, return empty array
    if (!documentId) {
        return [];
    }

    return (await GetUnitsByDocumentId({ id: documentId })).data;
};

export const fetchCostSymbolByHabitId = async (habitId: string): Promise<string> => {
    if (!habitId) return "";
    const habit = await fetchHabitByDocumentId(habitId);
    if (!habit?.habitStackId) return "";
    const habitStack = await fetchHabitStackByDocumentId(habit.habitStackId);
    if (!habitStack?.unit) return "";
    const units = await fetchUnitsByDocumentId(habitStack.unit as string);
    return (units as any)?.[0]?.symbol ?? "";
};

export const fetchCostSymbolByHabitStackId = async (habitStackId: string): Promise<string> => {
    if (!habitStackId) return "";
    const habitStack = await fetchHabitStackByDocumentId(habitStackId);
    if (!habitStack?.unit) return "";
    const units = await fetchUnitsByDocumentId(habitStack.unit as string);
    return (units as any)?.[0]?.symbol ?? "";
};

export const fetchCostSymbolByHabitLinkId = async (habitLinkId: string): Promise<string> => {
    if (!habitLinkId) return "";
    const unit = await apiGetUnitByHabitLinkId(habitLinkId);
    return unit?.symbol ?? "";
};

export const fetchCostSymbolByHabitLinkItemId = async (habitLinkItemId: string): Promise<string> => {
    if (!habitLinkItemId) return "";
    const item = await fetchHabitLinkItemByDocumentId(habitLinkItemId);
    if (!item?.habitLinkId) return "";
    return fetchCostSymbolByHabitLinkId(item.habitLinkId);
};