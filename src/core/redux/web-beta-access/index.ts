import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IWebBetaAccessState {
  /** Whether the current visitor has been granted web beta access. */
  webBetaAccess: boolean;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: IWebBetaAccessState = {
  webBetaAccess: false,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const WebBetaAccessSlice = createSlice({
  name: "webBetaAccess",
  initialState,
  reducers: {
    setWebBetaAccess: (state, action: PayloadAction<boolean>) => {
      state.webBetaAccess = action.payload;
    },
    resetWebBetaAccess: () => initialState,
    /** Alias for logout flows. Revokes web beta access on user logout. */
    setWebBetaAccessLogOut: () => initialState,
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
  setWebBetaAccess,
  resetWebBetaAccess,
  setWebBetaAccessLogOut,
} = WebBetaAccessSlice.actions;

export const WebBetaAccessAction = WebBetaAccessSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectWebBetaAccess = (state: {
  webBetaAccess: IWebBetaAccessState;
}): boolean => state.webBetaAccess.webBetaAccess;

// ─── Default export = the slice object (store reads .reducer off it) ──────────
export default WebBetaAccessSlice;
