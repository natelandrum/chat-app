"use client";

import { Button, Modal, Typography } from "@mui/material";
import { useIdleLogout } from "@/lib/hooks/useIdleLogout";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUserId, upsertKnownUsers } from "@/lib/redux/user/userSlice";
import { RootState } from "@/lib/store";

export default function SessionWatcher() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const { timeLeft, modalOpen, resetTimer, closeModal } = useIdleLogout();
  const currentUserId = useSelector((state: RootState) => state.user.currentUserId);


  const minutes = Math.floor(timeLeft / 60_000);
  const seconds = Math.floor((timeLeft % 60_000) / 1000);

  useEffect(() => {
    const interval = setInterval( async () => {
      await fetch("/api/ping-session");
      await fetch("/api/auth/session");
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
if (
  status === "authenticated" &&
  session?.user?.id &&
  session.user.id !== currentUserId
) {
  dispatch(setCurrentUserId(session.user.id));
  dispatch(
    upsertKnownUsers([
      {
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      },
    ])
  );
}
  }, [session, status, currentUserId, dispatch]);

  return (
    <Modal open={modalOpen} onClose={closeModal}>
      <div
        style={{
          padding: "24px",
          background: "#fff",
          borderRadius: "10px",
          width: "90%",
          maxWidth: "400px",
          margin: "15% auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <Typography 
        variant="h6" 
        sx={{ color: "#1a1a1a" }}
        >
          Session Expiry Warning
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#1a1a1a", 
                marginTop: "8px" 
              }}
        >
          Your session will expire in: {minutes}:
          {seconds.toString().padStart(2, "0")}
        </Typography>
        <div style={{ marginTop: "24px" }}>
          <Button 
          variant="contained" 
          color="primary" 
          onClick={resetTimer}
          >
            Continue Session
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              closeModal();
              signOut();
            }}
            style={{ marginLeft: "12px" }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </Modal>
  );
}


