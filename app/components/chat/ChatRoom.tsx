"use client";

import { ChannelProvider } from "ably/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveRoom } from "@/lib/redux/chat/chatSlice";

interface ChatRoomProps {
  roomId: string;
  children: React.ReactNode;
}

export default function ChatRoom({ roomId, children }: ChatRoomProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveRoom(roomId));
  }, [dispatch, roomId]);

  return (
    <ChannelProvider channelName={`chat:${roomId}`}>{children}</ChannelProvider>
  );
}
