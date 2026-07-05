import { IUser, UserTempData } from "@/types/section-a/user";
import { createSlice } from "@reduxjs/toolkit";

export interface IReduxUser {
  auth: string | null;
  userdata: any | null;
  tempdata: UserTempData | null;
  email: string | null;
}

export const tempdata: UserTempData = {
  first: "",
  last: "",
  username: "",
  fullName: "",
  email: "",
  photoUrl: "",
};

const userdata: IUser = {
  documentId: "",
  userId: "",
  username: "",
  id: "",
  lastName: "",
  firstName: "",
  fullName: "",
  tags: [],
  roles: [],
  description: "",
  photo: "",
  email: "",
  created: new Date(),
  updated: new Date(),
};

const initialState: IReduxUser = {
  auth: "",
  userdata,
  tempdata,
  email: "",
};

const UserData = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAuth: (state, action) => {
      state.auth = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserData: (state, action) => {
      state.userdata = action.payload;
    },
    setTempData: (state, action) => {
      state.tempdata = { ...action.payload };
    },
    setUserLogout: (state) => {
      state.auth = null;
      state.userdata = null;
    },
    setUserCollectData: (state, action) => {
      state.userdata.collectdata = { ...action.payload };
    },
  },
});

export const { setUserLogout } = UserData.actions;

export const selectUser = (state: { user: IReduxUser }) => state.user;
export const selectUserAuth = (state: { user: IReduxUser }) => state.user.auth;

export const UserDataAction = UserData.actions;

export default UserData;
