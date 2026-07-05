export interface IUser {
  documentId?: string;
  userId?: string; // Firebase uid
  username?: string;
  id?: string;
  displayName?: string;
  lastName?: string;
  firstName?: string;
  fullName?: string;
  tags?: string[];
  roles?: string[];
  description?: string;
  photo?: string;
  bannerImage?: string;
  email?: string;
  created?: Date;
  updated?: Date;
}

export interface UserTempData {
  first: string;
  last: string;
  username: string;
  fullName?: string;
  email?: string;
  photoUrl?: string;
}

export type ApiResponse<T> = {
  data: T;
  status: number;
};

export type FirestoreUser = {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  [key: string]: any;
};
