"use client";

import { useState, useEffect } from "react";
import { Dialog, Button, TextField, Autocomplete } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setNewChatModalOpen } from "@/lib/redux/chat/chatSlice";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";
import { PaginatedQueryData } from "@/lib/definitions";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function NewChatModal() {
  const open = useSelector((state: RootState) => state.chat.newChatModalOpen);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chatName, setChatName] = useState("");
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { data: session } = useSession();

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        axios.post("/api/users", JSON.stringify({ search: searchQuery })).then((res) => res.status === 200 ? setUsers(res.data.users) : []);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);
  
  const handleCloseModal = () => {
    dispatch(setNewChatModalOpen(false));
    setSearchQuery("");
    setChatName("");
    setSelectedUsers([]);
    setUsers([]);
  };

  const handleCreateChat = async () => {
    const participantIds = selectedUsers.map((user) => user.id);
    setLoading(true);
    const response = await axios.post("/api/chats", {
      name: chatName,
      participants: participantIds,
    });

    if (response.status === 200) {
      const newChat = {
        id: response.data.id,
        name: chatName,
        members: [...participantIds, session?.user?.id],
        created_at: new Date().toISOString(),
        last_message_preview: null,
        unread_count: 0,
      };

      // Optimistically update first page
      queryClient.setQueryData(["chats"], (oldData: PaginatedQueryData) => {
        console.log("Old Data:", oldData);
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              chats: [newChat, ...oldData.pages[0].chats || []],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
      handleCloseModal();
    } else {
      console.error("Error creating chat:", response.data);
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      fullWidth
      maxWidth="sm"
    >
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-50 flex justify-center items-center">
          <CircularProgress />
        </div>
      )}

      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Create New Chat</h2>

        <TextField
          label="Chat Name"
          fullWidth
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          sx={{
            marginBottom: 2,
          }}
        />

        <Autocomplete
          multiple
          options={users.filter(
            (user) => !selectedUsers.some((selected) => selected.id === user.id)
          )}
          getOptionLabel={(option) => `${option.name} (${option.email})`}
          onChange={(_, value) => setSelectedUsers(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Participants"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        />

        <div className="flex justify-end gap-2">
          <Button onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleCreateChat} variant="contained">
            Create
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
