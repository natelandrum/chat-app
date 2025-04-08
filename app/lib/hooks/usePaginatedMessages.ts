import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePaginatedMessages = (roomId: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", roomId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axios.get(`/api/messages?conversation_id=${roomId}&cursor=${pageParam || ""}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
    enabled: !!roomId,
  });
};
