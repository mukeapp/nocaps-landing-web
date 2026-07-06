

export interface Friend {
  documentId?: string; // Unique identifier for the document
  id?: string; // Unique identifier for the HabitTracker
  userId?: string; // Unique identifier for the user associated with the HabitTracker
  friendUserId?: string;
  areFriend?: boolean; //
  friendRequestStatus?: string;
  relationship?: string;
  isSender?: boolean;
  isReceiver?: boolean;
  createdAt?: Date; // Timestamp for when the HabitTracker was created
  updatedAt?: Date; // Timestamp for the last update to the HabitTracker
}

export type UsersPagination= {
  users: Array<{
    documentId: string;
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    username: string;
    roles?: string[];
    photo?: string | null;
    email?: string | null;
  }>;
  numberOfPages: number;
  pageSize: number;
  pageNumber: number;          // current page
  totalNumberOfUsers: number;
};

export type UsersComponentPagination = {
  users: Array<{
    documentId: string;
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    username: string;
    roles?: string[];
    photo?: string | null;
    email?: string | null;
    friend: Friend;
  }>;
  numberOfPages: number;
  pageSize: number;
  pageNumber: number;          // current page
  totalNumberOfUsers: number;
};

export type FetchResult<T> = { items: T[]; hasMore: boolean };

export type PageFetcher<T> = (
  userId: string,
  page: number,
  pageSize: number
) => Promise<{ items: T[]; hasMore: boolean }>;