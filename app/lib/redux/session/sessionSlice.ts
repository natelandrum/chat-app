import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  lastActivity: number;
  sessionModalOpen: boolean;
}

const initialState: SessionState = {
  lastActivity: Date.now(),
  sessionModalOpen: false,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    updateLastActivity(state, action: PayloadAction<number>) {
      state.lastActivity = action.payload;
    },
    setSessionModalOpen(state, action: PayloadAction<boolean>) {
      state.sessionModalOpen = action.payload;
    },
  },
});

export const { updateLastActivity, setSessionModalOpen } = sessionSlice.actions;
export default sessionSlice.reducer;