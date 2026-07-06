export type ApiResponse<T> = {
  data: T;
  status: number;
};

// Extend to your real user shape as needed
export type FirestoreUser = {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  // add your custom fields here...
  [key: string]: any;
};

export interface Payload {
  id?: string;
  newOwnerUserId?: string;
  oldOwnerUserId?: string;
  habitStackId?: string;
  habitId?: string;
  habitLinkId?: string;
  habitLinkItemId?: string;
  valid?: boolean;
  data?: any;
  userId?: string;
  sectorId?: string;
  pageSize?: number;
  pageNumber?: number;
  marketAdminUserId?: string;
  marketOwnerId?: string;
  isMarketOwned?: boolean;
}
