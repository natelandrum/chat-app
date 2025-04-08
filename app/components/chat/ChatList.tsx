"use client";

import { usePaginatedChats } from "@/lib/hooks/usePaginatedChats";
import Loading from "@/loading";
import { useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { Chat } from "@/lib/definitions";

export default function ChatList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePaginatedChats();

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
    <div className="flex flex-col p-4 mt-12 gap-3 max-w-xl mx-auto">
      {uniqueChats.map((chat: Chat) => (
        <Link key={chat.id} href={`/chat/${chat.id}?chatName=${chat.name}`}>
          <div className="bg-gray-800 text-white p-4 rounded shadow flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold truncate">{chat.name}</h3>
              <p className="text-sm text-gray-400 truncate">
                {chat.last_message_preview || "No messages yet"}
              </p>
            </div>
            <div className="flex-shrink-0 text-sm text-gray-400">
              Members: {chat.members.length}
            </div>
          </div>
        </Link>
      ))}

      <div ref={loaderRef} className="h-12">
        {isFetchingNextPage && <p className="text-center">Loading more...</p>}
      </div>
    </div>
  );
}
