import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    activeRoomId: null as string | null,
    unreadByRoom: {} as Record<string, number>,
    newChatModalOpen: false,
};
  

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveRoom(state, action: PayloadAction<string>) {
      state.activeRoomId = action.payload;
      state.unreadByRoom[action.payload] = 0;
    },
    setNewChatModalOpen(state, action: PayloadAction<boolean>) {
      state.newChatModalOpen = action.payload;
    },
  },
});

export const {
  setActiveRoom,
  setNewChatModalOpen,
} = chatSlice.actions;

export default chatSlice.reducer;