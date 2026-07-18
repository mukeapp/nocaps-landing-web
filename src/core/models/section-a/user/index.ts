import {Friend} from "../../section-b";

export interface IUser  {
  documentId?: string; // Unique identifier for the user document
  userId?: string; // This is firebase user id When i login firebase give this unique id
  username?: string; // User's username
  id?: string; // Unique identifier for the
  displayName?: string;
  lastName?: string; // User's last name
  firstName?: string; // User's first name
  fullName?: string; // User's full name
  tags?: string[]; // Array of interests or tags
  roles?: string[]; // Array of roles (can be empty)
  description?: string; // Description or bio of the user
  photo?: string; // URL of the user's profile photo
  bannerImage?: string; // URL of the user's banner image
  email?: string; // User's email address
  created?: Date; // Creation timestamp
  updated?: Date; // Last updated timestamp
}

export interface UserTempData{
  first: string;
  last: string;
  username: string;
  fullName?: string;
  email?: string;
  photoUrl?: string;
}

export interface IUserComponent  {
  documentId?: string; // Unique identifier for the user document
  userId?: string; // This is firebase user id When i login firebase give this unique id
  username?: string; // User's username
  id?: string; // Unique identifier for the
  lastName?: string; // User's last name
  firstName?: string; // User's first name
  tags?: string[]; // Array of interests or tags
  roles?: string[]; // Array of roles (can be empty)
  description?: string; // Description or bio of the user
  photo?: string; // URL of the user's profile photo
  email?: string; // User's email address
  created?: Date; // Creation timestamp
  updated?: Date; // Last updated timestamp
  friend?:Friend;
}