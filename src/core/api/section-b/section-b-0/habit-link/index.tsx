import {API} from "@/core/clients/axios";

export const SaveHabitLinks = async (payload: any) => {
  const request = `/habit-links`;
  try {
    const response = await API.post(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.error("Error in SaveHabitLinks: ", err);
    return { data: null, status: 500 };
  }
};

export const GetDataHabitLinkByUserIDScreen = async (payload: any) => {
  const request = `/habit-links/by-userId/${payload.userId}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.error("Error in GetDataHabitLinkByUserIDScreen: ", err);
    return { data: null, status: 500 };
  }
};


export const GetDataHabitLinkItemsScreen = async (payload: any) => {
  const request = `/habit-link-components/by-habitLinkId/${payload.docid}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.error("Error in GetDataHabitLinkItemsScreen: ", err);
    return { data: null, status: 500 };
  }
};


export const DeleteHabitLinkItem = async (payload: any) => {
  const request = `/habit-link-items/${payload?.id}`;
  console.log(request);
  try {
    const response = await API.delete(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.error("Error in DeleteHabitLinkItem: ", err);
    return { data: null, status: 500 };
  }
};



export const SaveHabitLinkItemLikes = async (payload: any) => {
  const request = `/habit-link-item-likes`;
  try {
    const response = await API.post(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.error("Error in SaveHabitLinkItemLikes: ", err);
    return { data: null, status: 500 };
  }
};
export const updateHabitLinkItemLikes = async (payload: any) => {
  const request = `/habit-link-item-likes/${payload.docid}`;
  try {
    const response = await API.put(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.error("Error in updateHabitLinkItemLikes: ", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitLinksByHabitId = async (payload: any) => {
  const request = `/habit-links/by-habitId/${payload.habitId}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.error("Error in GetHabitLinksByHabitId: ", err);
    return { data: null, status: 500 };
  }
};

export const GetHabitLinksComponentsByHabitId = async (payload: any) => {
  const request = `/habit-link-components/by-habitId/array/${payload.habitId}`;
  try {
    const response = await API.get(request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.error("Error in GetHabitLinksComponentsByHabitLinkId: ", err);
    return { data: null, status: 500 };
  }
};

export const CopyHabitLinkToAnotherUser = async (payload: any) => {
  const request = `/habitLink-data-etl/copy-to-new-user`;
  try {
    const response = await API.post(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("CopyHabitLinkToAnotherUser error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
}

export const CopyHabitLinkItemToAnotherUser = async (payload: any) => {
  const request = `/habitLinkItem-data-etl/copy-to-new-user`;
  try {
    const response = await API.post(request, payload.data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, status } = response;
    return {
      data,
      status,
    };
  } catch (err) {
    console.log("CopyHabitLinkItemToAnotherUser error:", err);
    //throw err;
    return { data: null, status: 500 };
  }
}