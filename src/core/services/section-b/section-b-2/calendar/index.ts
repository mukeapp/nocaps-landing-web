import {fetchHabitCalendarByHabitIdAndDays, fetchHabitLinkCalendarByHabitLinkIdAndDays, fetchHabitLinkItemCalendarByHabitLinkItemIdAndDays, fetchHabitStackCalendarByHabitStackIdAndDays} from "@/core/api/section-b";

export const getHabitStackCalendarByHabitStackIdAndDays = async (payload: any): Promise<any[]> => {
    const res = await fetchHabitStackCalendarByHabitStackIdAndDays(payload);
    return res?.data || [];
}

export const getHabitCalendarByHabitIdAndDays = async (payload: any): Promise<any[]> => {
    const res = await fetchHabitCalendarByHabitIdAndDays(payload);
    return res?.data || [];
}

export const getHabitLinkCalendarByHabitLinkIdAndDays = async (payload: any): Promise<any[]> => {
    const res = await fetchHabitLinkCalendarByHabitLinkIdAndDays(payload);
    //console.log("---Fetched HabitLink Calendar Data:", res?.data);
    return res?.data || [];
}

export const getHabitLinkItemCalendarByHabitLinkItemIdAndDays = async (payload: any): Promise<any[]> => {
    const res = await fetchHabitLinkItemCalendarByHabitLinkItemIdAndDays(payload);
    return res?.data || [];
}