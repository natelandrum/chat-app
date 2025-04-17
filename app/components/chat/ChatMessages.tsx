"use client";

import { useChannel } from "ably/react";
import { usePaginatedMessages } from "@/lib/hooks/usePaginatedMessages";
import { useEffect, useRef, useState, useMemo, startTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { InboundMessage } from "ably";
import { useSession } from "next-auth/react";
import { RootState } from "@/lib/store";
import ChatMessage from "@/components/chat/ChatMessage";
import {
  Tooltip,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Message, PaginatedQueryData } from "@/lib/definitions";
import { upsertKnownUsers } from "@/lib/redux/user/userSlice";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";

interface ChatMessagesProps {
  roomId: string;
  chatName: string;
}

export default function ChatMessages({ roomId, chatName }: ChatMessagesProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: paginationStatus,
  } = usePaginatedMessages(roomId);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const { channel } = useChannel({ channelName: `chat:${roomId}` });
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUserId
  );

  const shouldRender =
    roomId && status === "authenticated" && session?.user?.id;

  const uniqueMessages = useMemo(() => {
    const allMessages =
      data?.pages?.flatMap((page) => page.messages) || [];

    const seen = new Set<string>();
    return allMessages.filter((msg) => {
      if (seen.has(msg.id)) return false;
      seen.add(msg.id);
      return true;
    });
  }, [data]);

  const senderIds = useMemo(() => {
    return Array.from(new Set(uniqueMessages.map((msg) => msg.sender_id)));
  }, [uniqueMessages]);



  const userEntities = useSelector((state: RootState) => state.user.entities);

  useEffect(() => {
    const missingIds = senderIds.filter((id) => !userEntities[id]);

    if (missingIds.length === 0) return;

    const fetchMissingUsers = async () => {
      const responses = await Promise.all(
        missingIds.map((id) =>
          axios
            .post("/api/user", { userId: id })
            .then((res) => res.data)
            .catch(() => null)
        )
      );

      const validUsers = responses.filter((u) => u !== null);
      dispatch(upsertKnownUsers(validUsers));
    };

    fetchMissingUsers();
  }, [senderIds, userEntities, dispatch]);

  const userList = useMemo(() => {
    return Object.values(userEntities).filter(user => senderIds.includes(user.id));
  }, [userEntities, senderIds]);

  useEffect(() => {
    const loader = loaderRef.current;
    const container = containerRef.current;

    if (!loader || !container || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: container,
        threshold: 0.1,
      }
    );

    observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const updateQueryData = (newMessage: Message) => {
    startTransition(() => {
      queryClient.setQueryData(
        ["messages", roomId],
        (oldData: PaginatedQueryData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                messages: [newMessage, ...(oldData.pages[0].messages || [])],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      )
    });
  };

  useEffect(() => {
    const handler = (message: InboundMessage) => {
      if (!message?.data || message.data.sender_id === currentUserId) return;
      updateQueryData(message.data);
    };
    channel?.subscribe("new-message", handler);
    return () => channel?.unsubscribe("new-message", handler);
  }, [channel, currentUserId, roomId]);

  const sendMessage = async () => {
    if (!input.trim() || !roomId || !currentUserId) return;

    const response = await axios.post("/api/messages", {
      conversation_id: roomId,
      sender_id: currentUserId,
      content: input,
    });
    if (response.status !== 200) return;
    if (response.status === 200) {
      const { id, conversation_id, sender_id, content, created_at } = response.data.message;
      const message = { id, sender_id, content, conversation_id, created_at };
      channel.publish("new-message", message);
      updateQueryData(message);
      setInput("");
    }
    
  };

  if (!shouldRender) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        my: "16px",
        p: { xs: 1, md: 2 },
        height: { xs: "calc(100vh - 160px)" },
        display: "flex",
        flexDirection: "column",
        borderRadius: { xs: 1, md: 2 },
        width: "95%",
        maxWidth: "600px",
        mx: "auto",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} px={1}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
          {chatName}
        </Typography>
        {userList.length > 0 && (
          <Box color="text.secondary" fontSize={{ xs: 'x-small', md: 'small' }}>
            {userList.slice(0, 2).map((u, i) => (
              <div key={u?.id} className="truncate max-w-[100px]">
                {u?.name || u?.email}
                {i === 0 && userList.length > 1 && ", "}
              </div>
            ))}
            {userList.length > 2 && (
              <Tooltip
                title={userList
                  .slice(2)
                  .map((u) => u?.name || u?.email)
                  .join(", ")}
                arrow
              >
                <span style={{ cursor: "pointer" }}>
                  +{userList.length - 2} more
                </span>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>

      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column-reverse",
          overflowY: "auto",
          border: 1,
          borderColor: "divider",
          p: { xs: 1, md: 2 },
          borderRadius: { xs: 1, md: 2 },
          bgcolor: "background.paper",
          mb: { xs: 1, md: 2 },
        }}
      >
        {paginationStatus === "pending" && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={24} />
          </Box>
        )}
        {uniqueMessages.map((msg, index) => {
          const user = userEntities[msg.sender_id];
          return currentUserId ? (
            <ChatMessage key={msg.id} msg={msg} currentUserId={currentUserId} user={user} roomId={roomId} previousMessage={uniqueMessages[index - 1]} nextMessage={uniqueMessages[index + 1]}/>
          ) : null;
        })}
        <div ref={loaderRef}>
          {isFetchingNextPage && <CircularProgress size={20} />}
        </div>
      </Box>

      <Box display="flex" gap={1} px={1}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          fullWidth
          multiline
          maxRows={3}
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          sx={{ 
            '& .MuiOutlinedInput-root': {
              fontSize: { xs: '0.875rem', md: '1rem' }
            }
          }}
        />
        <Button
          onClick={sendMessage}
          variant="contained"
          color="primary"
          sx={{ 
            minWidth: { xs: '40px', md: 'auto' },
            px: { xs: 1, md: 2 }
          }}
        >
          <SendIcon fontSize="small" sx={{ display: { xs: 'block', md: 'none' } }} />
          <span className="hidden md:inline">Send</span>
        </Button>
      </Box>
    </Paper>
  );
}
