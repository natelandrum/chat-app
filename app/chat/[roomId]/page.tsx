import ChatRoom from "@/components/chat/ChatRoom";
import ChatMessages from "@/components/chat/ChatMessages";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ chatName?: string }>;
}

export default async function RoomPage({ params, searchParams }: RoomPageProps) {
  const { roomId } = await params;
  const { chatName } = await searchParams || "";

  if (!roomId || !chatName) return null;


  return (
    <ChatRoom roomId={roomId}>
      <ChatMessages roomId={roomId} chatName={chatName} />
    </ChatRoom>
  );
}

