"use client";

import GoogleIcon from "@mui/icons-material/Google";
import { Button, Typography, Divider, Paper } from "@mui/material";
import { signIn } from "next-auth/react";

const handleSignIn = () => {
  signIn("google");
};

export default function SignInModule() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <Paper 
        elevation={3}
        sx={{ 
          bgcolor: "#1e293b", // slate-800
          p: { xs: 3, md: 8 },
          borderRadius: 2,
          maxWidth: { xs: '100%', sm: '400px' },
          width: '100%'
        }}
      >
        <div className="text-center text-gray-300">
          <Typography
            variant="h4"
            sx={{ 
              color: "white", 
              fontWeight: "bold",
              fontSize: { xs: '1.5rem', md: '2.125rem' },
              mb: 1
            }}
          >
            Welcome to Chat App
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              mb: 2,
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Please sign in to continue
          </Typography>
          <Divider
            sx={{
              borderColor: "gray",
              borderWidth: "1.2px",
              mb: 3,
              mt: 2,
            }}
          />
          <Button
            variant="contained"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleSignIn}
            sx={{
              backgroundColor: "#dc2626", // red-600
              color: "white",
              py: { xs: 1, md: 1.5 },
              "&:hover": {
                backgroundColor: "#b91c1c", // red-700
              },
            }}
          >
            Sign in with Google
          </Button>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 2,
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              px: 1
            }}
          >
            By signing in, you agree to our Terms and Conditions and Privacy
            Policy.
          </Typography>
        </div>
      </Paper>
    </div>
  );
}
