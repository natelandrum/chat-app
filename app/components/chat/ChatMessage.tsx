"use client";

import React, { useState, startTransition } from "react";
import clsx from "clsx";
import { Message, PaginatedQueryData } from "@/lib/definitions";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, TextField, Button } from "@mui/material";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { KnownUser } from "@/lib/redux/user/userSlice";

type Props = {
  msg: Message;
  previousMessage?: Message;
  nextMessage?: Message;
  currentUserId: string;
  user: KnownUser;
  roomId: string;
};

function ChatMessage({
  msg,
  previousMessage,
  nextMessage,
  currentUserId,
  user,
  roomId,
}: Props) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(msg.content);
  const [updating, setUpdating] = useState(false);
  const queryClient = useQueryClient();

  const isCurrentUser = msg.sender_id === currentUserId;
  const open = Boolean(anchor);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchor(null);
  };

  const updateCache = (updatedMsg: Partial<Message>) => {
    startTransition(() => {
      queryClient.setQueryData(
        ["messages", roomId],
        (oldData: PaginatedQueryData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              messages: page.messages?.map((m) =>
                m.id === msg.id ? { ...m, ...updatedMsg } : m
              ),
            })),
          };
        }
      );
    });
  };

  const removeFromCache = (id: string) => {
    startTransition(() => {
      queryClient.setQueryData(
        ["messages", roomId],
        (oldData: PaginatedQueryData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              messages: page.messages?.filter((m) => m.id !== id),
            })),
          };
        }
      );
    });
  };

  const handleEdit = async () => {
    setUpdating(true);
    try {
      await axios.put("/api/messages", {
        messageId: msg.id,
        newContent: editedText,
      });
      updateCache({ content: editedText });
      setIsEditing(false);
      setAnchor(null);
    } catch (error) {
      console.error("Failed to edit message:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setUpdating(true);
    try {
      await axios.delete("/api/messages", {
        data: { messageId: msg.id },
        headers: { "Content-Type": "application/json" },
      });
      removeFromCache(msg.id);
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  const currentDate = new Date(msg.created_at).toLocaleDateString();
  const previousDate = previousMessage
    ? new Date(previousMessage.created_at).toLocaleDateString()
    : null;
  const nextDate = nextMessage
    ? new Date(nextMessage.created_at).toLocaleDateString()
    : null;

  return (
    <>
      {currentDate !== previousDate && (
        <div className="text-center text-gray-500 my-4">{previousDate}</div>
      )}
      <div
        className={clsx(
          "flex mb-4 mr-0",
          isCurrentUser ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={clsx(
            "flex group flex-col relative",
            isCurrentUser ? "items-end" : "items-start"
          )}
        >
          <div
            className={clsx(
              "px-4 py-2 w-fit max-w-[50vw] rounded-4xl",
              isCurrentUser
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-white"
            )}
          >
            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit();
                }}
                className="space-y-2"
              >
                <TextField
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  size="small"
                  fullWidth
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setIsEditing(false)}
                    size="small"
                    sx={{ color: "white" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={updating}
                    type="submit"
                    variant="contained"
                    size="small"
                  >
                    Save
                  </Button>
                </div>
              </form>
            ) : (
              msg.content
            )}
          </div>

          {isCurrentUser && !isEditing && (
            <>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                className="absolute -top-8 h-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                sx={{
                  transform: "translate(50%, -50%)",
                  zIndex: 10,
                }}
              >
                <MoreVertIcon
                  fontSize="small"
                  sx={{
                    color: "white",
                    backgroundColor: "black",
                    borderRadius: "50%",
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={anchor}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    setIsEditing(true);
                    setAnchor(null);
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}

          <div
            className={clsx(
              "text-gray-400 opacity-0 group-hover:opacity-100 text-[12px]",
              isCurrentUser ? "mr-4 -m-[0.6rem]" : "ml-4"
            )}
          >
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name || user.email || "System"}
            width={20}
            height={20}
            className={clsx(
              "rounded-full absolute",
              isCurrentUser
                ? "bottom-0 right-0 translate-x-1/2 -translate-y-1/12"
                : "bottom-0 left-0 -translate-x-1/2 -translate-y-1/2"
            )}
          />
        </div>
      </div>
      {!nextDate && (
        <div className="text-center text-gray-500 my-4">{previousDate}</div>
      )}
    </>
  );
}

export default React.memo(ChatMessage);
