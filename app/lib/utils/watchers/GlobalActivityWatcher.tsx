"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLastActivity } from "@/lib/redux/session/sessionSlice";
import { RootState } from "@/lib/store";

export default function GlobalActivityTracker() {
  const dispatch = useDispatch();
  const sessionModalOpen = useSelector((state: RootState) => state.session.sessionModalOpen);

  useEffect(() => {
    const handleActivity = () => {
      if (sessionModalOpen) return;
      dispatch(updateLastActivity(Date.now()));
    };

    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) => window.addEventListener(event, handleActivity));

    // Set immediately on mount
    handleActivity();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [dispatch, sessionModalOpen]);

  return null;
}
