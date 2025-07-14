import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  status: boolean;
  userData: string | null;
}

const initialState: UserState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      console.log("Hey Prabhjot this is the action.payload.", action.payload);
      console.log("Hey Prabhjot this is the current state.", state);

      state.status = true;
      state.userData = action.payload;
    },
    logOut: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logOut } = authSlice.actions;

export default authSlice.reducer;
