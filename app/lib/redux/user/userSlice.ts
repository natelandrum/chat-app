import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

export type KnownUser = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
};

const userAdapter = createEntityAdapter<KnownUser>();

const initialState = userAdapter.getInitialState({
  currentUserId: null as string | null,
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUserId(state, action) {
      state.currentUserId = action.payload;
    },
    addKnownUser: userAdapter.addOne,
    upsertKnownUsers: userAdapter.upsertMany,
    removeKnownUser: userAdapter.removeOne,
  },
});

export const {
  setCurrentUserId,
  addKnownUser,
  upsertKnownUsers,
  removeKnownUser,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const {
  selectById: selectKnownUserById,
  selectAll: selectAllKnownUsers,
} = userAdapter.getSelectors((state: RootState) => state.user);
