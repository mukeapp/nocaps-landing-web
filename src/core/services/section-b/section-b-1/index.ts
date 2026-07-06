import {
  DeleteFriendRequest,
  GetUserAreFriends,
  GetUserFriendsRequests,
  GetUserNonFriends,
  PatchFriendRequestAreFriends,
  SaveFriendRequest,
} from "@/core/api/section-b";
import {IUser, IUserComponent} from "@/core/models/section-a";
import {
  FetchResult,
  Friend,
  HabitComponent,
  HabitLinkComponent,
  HabitLinkItemComponent,
  HabitStackComponent,
  UsersComponentPagination,
  UsersPagination,
} from "@/core/models/section-b";
import {uuidUtils} from "@/core/utils";

const matchesId = (item: any, id?: string): boolean =>
  !id || item?.id === id || item?.documentId === id;

const getHabits = (
  stacks: any[],
  filter: boolean,
  habitId?: string,
): HabitComponent[] => {
  const result: HabitComponent[] = [];
  for (const stack of stacks) {
    for (const h of stack?.habitData ?? []) {
      if (filter && !matchesId(h, habitId)) continue;
      result.push({
        ...h,
        marketOwnerId: stack?.marketOwnerId,
      } as HabitComponent);
    }
  }
  return result;
};

const getHabitLinks = (
  stacks: any[],
  filter: boolean,
  habitLinkId?: string,
): HabitLinkComponent[] => {
  const result: HabitLinkComponent[] = [];
  for (const stack of stacks) {
    for (const h of stack?.habitData ?? []) {
      for (const hl of h?.habitLinkData ?? []) {
        if (filter && !matchesId(hl, habitLinkId)) continue;
        result.push({
          ...hl,
          marketOwnerId: stack?.marketOwnerId,
        } as HabitLinkComponent);
      }
    }
  }
  return result;
};

const getHabitLinkItems = (
  stacks: any[],
  filter: boolean,
  habitLinkItemId?: string,
  habitLinkId?: string,
): HabitLinkItemComponent[] => {
  console.log(
    "Filtering HabitLinkItems with habitLinkItemId:",
    habitLinkItemId,
    "and habitLinkId:",
    habitLinkId,
  );

  console.log("Stacks data for filtering:", JSON.stringify(stacks, null, 2));

  const result: HabitLinkItemComponent[] = [];
  for (const stack of stacks) {
    for (const h of stack?.habitData ?? []) {
      for (const hl of h?.habitLinkData ?? []) {
        if (filter && !matchesId(hl, habitLinkId)) continue;
        for (const hli of hl?.habitLinkItemComponentsData ?? []) {
          if (filter && !matchesId(hli, habitLinkItemId)) continue;
          result.push(hli as HabitLinkItemComponent);
        }
      }
    }
  }
  return result;
};

export const getHabitLinksForHabitLinkItem = (
  stacks: any[],
  filter: boolean = false,
  habitLinkId?: string,
  habitLinkItemId?: string,
): HabitLinkComponent[] => {
  const result: HabitLinkComponent[] = [];
  for (const stack of stacks) {
    for (const h of stack?.habitData ?? []) {
      for (const hl of h?.habitLinkData ?? []) {
        if (filter && !matchesId(hl, habitLinkId)) continue;
        const items = filter
          ? (hl?.habitLinkItemComponentsData ?? []).filter((hli: any) =>
              matchesId(hli, habitLinkItemId),
            )
          : (hl?.habitLinkItemComponentsData ?? []);
        result.push({
          ...hl,
          habitLinkItemComponentsData: items,
          marketOwnerId: stack?.marketOwnerId,
        } as HabitLinkComponent);
      }
    }
  }
  return result;
};

export const getHabitDataByCategory = (
  stacks: any[],
  habitCategoryId?: number,
  habitId?: string,
  habitLinkId?: string,
  habitLinkItemId?: string,
  filter: boolean = false,
) => {
  switch (habitCategoryId) {
    case 1:
      return stacks as HabitStackComponent[];
    case 2:
      return getHabits(stacks, filter, habitId);
    case 3:
      return getHabitLinks(stacks, filter, habitLinkId);
    case 4:
      return filter
        ? getHabitLinksForHabitLinkItem(
            stacks,
            filter,
            habitLinkId,
            habitLinkItemId,
          )
        : getHabitLinks(stacks, filter, habitLinkId);
    case 5:
      return getHabitLinksForHabitLinkItem(stacks, filter, habitLinkItemId);
    default:
      return stacks as any[];
  }
};

function mapUsersForPagination(res: UsersPagination): FetchResult<IUser> {
  const items: IUser[] = (res.users ?? []).map((u) => ({
    id: u.id,
    documentId: u.documentId,
    firstName: u.firstName ?? undefined,
    lastName: u.lastName ?? undefined,
    userId: u.userId,
    username: u.username,
    fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username,
    roles: u.roles ?? [],
    photo: u.photo ?? undefined,
    email: u.email ?? undefined,
  }));

  const hasMore = (res.pageNumber ?? 1) < (res.numberOfPages ?? 1);
  return { items, hasMore };
}

function mapUsersComponentForPagination(
  res: UsersComponentPagination,
): FetchResult<IUserComponent> {
  const items: IUserComponent[] = (res.users ?? []).map((u) => ({
    id: u.id,
    documentId: u.documentId,
    firstName: u.firstName ?? undefined,
    lastName: u.lastName ?? undefined,
    userId: u.userId,
    username: u.username,
    fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username,
    roles: u.roles ?? [],
    photo: u.photo ?? undefined,
    email: u.email ?? undefined,
    friend: u.friend ? { ...u.friend } : undefined,
  }));

  const hasMore = (res.pageNumber ?? 1) < (res.numberOfPages ?? 1);
  return { items, hasMore };
}

export const fetchNewFriends = async (
  userId: string,
  page: number,
  pageSize: number,
) => {
  const res = await GetUserNonFriends({ userId, page, pageSize });
  return res.data;
};

export const fetchFriendsRequests = async (
  userId: string,
  page: number,
  pageSize: number,
) => {
  const res = await GetUserFriendsRequests({ userId, page, pageSize });
  return mapUsersForPagination(res.data);
};

export const fetchNewFriendsAndMapForPagination = async (
  userId: string,
  pageNumber: number,
  pageSize: number,
) => {
  const res = await GetUserNonFriends({ userId, pageNumber, pageSize });
  return mapUsersForPagination(res.data);
};

export const fetchFriendsRequestsAndMapForPagination = async (
  userId: string,
  pageNumber: number,
  pageSize: number,
) => {
  const res = await GetUserFriendsRequests({ userId, pageNumber, pageSize });
  return mapUsersComponentForPagination(res.data);
};

export const fetchUserAreFriendsAndMapForPagination = async (
  userId: string,
  pageNumber: number,
  pageSize: number,
) => {
  const res = await GetUserAreFriends({ userId, pageNumber, pageSize });
  return mapUsersComponentForPagination(res.data);
};

export const updateFriendRequestAreFriends = async (
  docId: string,
  areFriends: boolean,
) => {
  const res = await PatchFriendRequestAreFriends({ docId, areFriends });
  return res.data;
};

export const createFriendRequest = async (userId: string, friendId: string) => {
  const friendPayload: Friend = {
    id: uuidUtils.generateUUID(),
    userId: userId,
    friendUserId: friendId,
    areFriend: false,
    friendRequestStatus: "pending",
    relationship: undefined,
    isSender: true,
    isReceiver: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const res = await SaveFriendRequest({ data: friendPayload });
  return res.data;
};

export const deleteFriendRequest = async (docId: string) => {
  const res = await DeleteFriendRequest({ docId });
  return res.data;
};
