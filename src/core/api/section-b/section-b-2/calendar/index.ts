import {apiRequest, handleApiError} from "@/core/utils";


export const fetchHabitStackCalendarByHabitStackIdAndDays = async (payload: any) => {
  try {
    const { id, data } = payload;
    const request = `/habit-stack-calendar-components/habit-stack-calendar/habit-calendar/by-habitStackId/${id}/by-days`;
    //console.log("POST Request:", request, "Payload:", data);
    return await apiRequest("post", request, { dates: data.dates }, "fetching habit stack calendar by days");
  } catch (err) {
    return handleApiError(err, "fetchHabitStackCalendarByHabitStackIdAndDays");
  }
}

export const fetchHabitCalendarByHabitIdAndDays = async (payload: any) => {
  try {
    const { id, data } = payload;
    const request = `/habit-calendar-components/habit-calendar/habit-calendar/by-habitId/${id}/by-days`;
    //console.log("POST Request:", request, "Payload:", data);
    return await apiRequest("post", request, { dates: data.dates }, "fetching habit calendar by days");
  } catch (err) {
    return handleApiError(err, "fetchHabitCalendarByHabitIdAndDays");
  }
}

export const fetchHabitLinkCalendarByHabitLinkIdAndDays = async (payload: any) => {
  try {
    const { id, data } = payload;
    const request = `/habit-link-calendar-components/habit-link-calendar/habit-calendar/by-habitLinkId/${id}/by-days`;
    //console.log("POST Request:", request, "Payload:", data);
    return await apiRequest("post", request, { dates: data.dates }, "fetching habit link calendar by days");
  } catch (err) {
    return handleApiError(err, "fetchHabitLinkCalendarByHabitLinkIdAndDays");
  }
}

export const fetchHabitLinkItemCalendarByHabitLinkItemIdAndDays = async (payload: any) => {
  try {
    const { id, data } = payload;
    const request = `/habit-link-item-calendar-components/habit-link-item-calendar/habit-calendar/by-habitLinkItemId/${id}/by-days`;
    //console.log("POST Request:", request, "Payload:", data);
    return await apiRequest("post", request, { dates: data.dates }, "fetching habit link item calendar by days");
  } catch (err) {
    return handleApiError(err, "fetchHabitLinkItemCalendarByHabitLinkItemIdAndDays");
  }
}