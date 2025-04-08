import NextAuth from "next-auth";
import { authOptions } from "@/auth.config";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(authOptions);
