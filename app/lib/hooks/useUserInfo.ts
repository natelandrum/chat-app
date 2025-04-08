import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { selectKnownUserById } from "@/lib/redux/user/userSlice";
import { upsertKnownUsers } from "@/lib/redux/user/userSlice";
import axios from "axios";
import { RootState } from "../store";

export function useUserInfo(userId: string | undefined | null) {
  const dispatch = useDispatch();
  const cachedUser = useSelector((state: RootState) =>
    userId ? selectKnownUserById(state, userId) : undefined
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || cachedUser) return;

    setLoading(true);
    axios.post(`/api/user`, JSON.stringify({ userId: userId }), {
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {
        dispatch(upsertKnownUsers([res.data]));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => setLoading(false));
  }, [userId, cachedUser, dispatch]);

  return { user: cachedUser, loading };
}
