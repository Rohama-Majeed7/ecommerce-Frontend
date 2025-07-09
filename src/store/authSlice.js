import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authenticator",
  initialState: {
    user: null,
    profilePic: "",
    token: "",
    value: 0,
    users: null,
    cartCount:0
  },
  reducers: {
    authUser: (state, action) => {
      state.user = action.payload;
    },
    setProfilePic: (state, action) => {
      state.profilePic = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      (state.token = ""), (state.user = null), (state.value = 0)
    },
    manageState: (state) => {
      state.value += 1;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
  },
});

export const { authUser, setProfilePic, setToken, logout, manageState,setUsers,setCartCount } =
  authSlice.actions;
export default authSlice.reducer;
