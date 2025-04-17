"use client";

import { usePaginatedChats } from "@/lib/hooks/usePaginatedChats";
import Loading from "@/loading";
import { useEffect, useRef } from "react";
import { IconButton, Typography } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { Chat, PaginatedQueryData } from "@/lib/definitions";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePaginatedChats();

  const queryClient = useQueryClient();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);
    return () => {
      const currentLoader = loaderRef.current;
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  const uniqueChatsMap = new Map<string, Chat>();

  data?.pages.forEach((page) => {
    page.chats.forEach((chat: Chat) => {
      uniqueChatsMap.set(chat.id, chat);
    });
  });

  const uniqueChats = Array.from(uniqueChatsMap.values());

  const handleDelete = async (id: string) => {
    if (!confirm(
      "Are you sure you want to delete this chat? This action cannot be undone."
    )) return;

    const res = await axios.delete(`/api/chats/`, {
      data: JSON.stringify({ conversation_id: id }),
    });

    if (res.status === 200) {
      queryClient.setQueryData(["chats"], (oldData: PaginatedQueryData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            chats: page.chats?.filter((chat: Chat) => chat.id !== id),
          })),
        };
      });
    }
  };

  if (status === "pending") return <Loading />;
  if (status === "error" || data.pages?.[0].chats.length === 0) {
    const isError = status === "error";
    return (
      <div
        className={clsx("flex justify-center items-center h-[80vh]", {
          "text-red-500": isError,
        })}
      >
        <Typography
          className={clsx("text-center text-wrap max-w-[50%]", {
            "text-red-500": isError,
          })}
          variant="h6"
        >
          {isError
            ? "Error loading chats. Reload page."
            : "No chats available. Please create a new chat or reload page if this is an error."}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 md:p-4 mt-4 md:mt-12 gap-2 md:gap-3 w-full max-w-full md:max-w-xl mx-auto">
      {uniqueChats.map((chat: Chat) => (
        <div
          key={chat.id}
          className="bg-gray-800 text-white rounded shadow hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <Link
              href={`/chat/${chat.id}?chatName=${chat.name}`}
              className="flex-grow p-2 md:p-4 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-4">
                <div className="flex flex-col w-full md:w-auto">
                  <h3 className="text-base md:text-lg font-bold truncate">{chat.name}</h3>
                  <p className="text-xs md:text-sm text-gray-400 truncate max-w-[200px] md:max-w-[250px]">
                    {chat.last_message_preview || "No messages yet"}
                  </p>
                </div>
                <div className="flex-shrink-0 text-xs md:text-sm text-gray-400 mt-1 md:mt-0">
                  Members: {chat.members.length}
                </div>
              </div>
            </Link>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                handleDelete(chat.id);
              }}
              aria-label="Delete chat"
              sx={{
                color: "gray",
                padding: { xs: "4px", md: "8px" },
                "&:hover": {
                  color: "red",
                  scale: 1.2,
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      ))}

      <div ref={loaderRef} className="h-10 md:h-12">
        {isFetchingNextPage && <p className="text-center text-sm md:text-base">Loading more...</p>}
      </div>
    </div>
  );
}
