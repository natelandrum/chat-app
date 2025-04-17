"use client";

import { Button, Modal, Typography, Box } from "@mui/material";
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
    <Modal 
      open={modalOpen} 
      onClose={closeModal}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 3, md: 4 },
          width: { xs: '85%', sm: '400px' },
          maxWidth: '450px',
          textAlign: 'center',
          mx: 2,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: "#1a1a1a",
            fontSize: { xs: '1.1rem', md: '1.25rem' }
          }}
        >
          Session Expiry Warning
        </Typography>
        <Typography
          variant="body1"
          sx={{ 
            color: "#1a1a1a", 
            mt: 1.5,
            mb: 2.5,
            fontSize: { xs: '0.9rem', md: '1rem' }
          }}
        >
          Your session will expire in: {minutes}:
          {seconds.toString().padStart(2, "0")}
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Button 
            variant="contained" 
            color="primary" 
            onClick={resetTimer}
            fullWidth
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
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
            fullWidth
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}


