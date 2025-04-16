import ChatRoom from "@/components/chat/ChatRoom";
import ChatMessages from "@/components/chat/ChatMessages";
import { auth } from "@/auth";
import { checkChatAccess } from "@/lib/actions";
import { notFound } from "next/navigation";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ chatName?: string }>;
}

export default async function RoomPage({ params, searchParams }: RoomPageProps) {
  const { roomId } = await params;
  const { chatName } = await searchParams || "";
  const session = await auth();
  const chatAccess = await checkChatAccess(
    session?.user?.id || "", roomId)

  if (!roomId || !chatName) return null;

  if (!chatAccess) {
    notFound();
  }


  return (
    <ChatRoom roomId={roomId}>
      <ChatMessages roomId={roomId} chatName={chatName} />
    </ChatRoom>
  );
}

