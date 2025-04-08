"use client";

import GoogleIcon from "@mui/icons-material/Google";
import { Button, Typography, Divider } from "@mui/material";
import { signIn } from "next-auth/react";

const handleSignIn = () => {
  signIn("google");
};

export default function SignInModule() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-slate-800 p-8 rounded-lg text-center text-gray-300">
        <Typography
          variant="h4"
          className="mb-4"
          sx={{ 
            color: "white", 
            fontWeight: "bold" 
        }}
        >
          Welcome to Chat App
        </Typography>
        <Typography 
        variant="body1" 
        className="mb-4"
        >
          Please sign in to continue
        </Typography>
        <Divider
          sx={{
            borderColor: "gray",
            borderWidth: "1.2px",
            marginBottom: 2,
            marginTop: 2,
          }}
        />
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleSignIn}
          sx={{
            backgroundColor: "#dc2626", // red-600
            color: "white",
            "&:hover": {
              backgroundColor: "#b91c1c", // red-700
            },
          }}
        >
          Sign in with Google
        </Button>
        <Typography
          variant="caption"
          className="mt-4"
          sx={{
            display: "block",
            marginTop: "10px",
          }}
        >
          By signing in, you agree to our Terms and Conditions and Privacy
          Policy.
        </Typography>
      </div>
    </div>
  );
}
