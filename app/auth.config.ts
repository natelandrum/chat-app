import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";
import type { NextAuthConfig } from "next-auth";


export const authOptions: NextAuthConfig = {
  adapter: PostgresAdapter(new Pool({
    connectionString: process.env.DATABASE_URL,
  })),
  session: {
    strategy: "database",
    maxAge: 15 * 60, // 15 minutes
    updateAge: 5 * 60, // 5 minutes
  },
  providers: [
    Google,
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.name = user.name;
      session.user.email = user.email;
      session.user.image = user.image;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
