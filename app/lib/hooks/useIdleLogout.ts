"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setSessionModalOpen, updateLastActivity } from "@/lib/redux/session/sessionSlice";
import { signOut } from "next-auth/react";

const INACTIVITY_LIMIT = 15 * 60 * 1000;

export function useIdleLogout() {
  const dispatch = useDispatch();
  const lastActivity = useSelector((state: RootState) => state.session.lastActivity);
  const modalOpen = useSelector((state: RootState) => state.session.sessionModalOpen);
  const [timeLeft, setTimeLeft] = useState<number>(INACTIVITY_LIMIT);

  // ⏱ countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      const timeRemaining = INACTIVITY_LIMIT - idleTime;
      setTimeLeft(timeRemaining);

      if (timeRemaining <= 60_000 && !modalOpen) {
        dispatch(setSessionModalOpen(true));
      }

      if (timeRemaining <= 0) {
        dispatch(setSessionModalOpen(false));
        signOut();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, lastActivity, modalOpen]);

  const resetTimer = () => {
    dispatch(updateLastActivity(Date.now()));
    dispatch(setSessionModalOpen(false));
    setTimeLeft(INACTIVITY_LIMIT);
  };

  return {
    timeLeft,
    modalOpen,
    closeModal: () => dispatch(setSessionModalOpen(false)),
    resetTimer,
  };
}
