export type Chat = {
  id: string;
  name: string;
  created_at: string;
  last_message_preview: string | null;
  unread_count: number; 
  members: string;
}

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: number;
};

export type PaginatedResponse = {
  chats?: Chat[];
  messages?: Message[];
  nextCursor: string | null;
};

export type PaginatedQueryData = {
  pages: PaginatedResponse[];
  pageParams: number[];
};
