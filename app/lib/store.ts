import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "@/lib/redux/chat/chatSlice";
import sessionReducer from "@/lib/redux/session/sessionSlice";
import userReducer from "@/lib/redux/user/userSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    session: sessionReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
