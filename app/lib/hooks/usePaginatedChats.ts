import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePaginatedChats = () => {
  return useInfiniteQuery({
    queryKey: ["chats"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axios.get(`/api/chats?cursor=${pageParam}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
  });
};
