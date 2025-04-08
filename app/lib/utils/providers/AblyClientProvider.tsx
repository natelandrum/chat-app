"use client";

import Ably from "ably";
import { AblyProvider } from "ably/react";
import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AblyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const clientRef = useRef<Ably.Realtime | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session && !clientRef.current) {
      clientRef.current = new Ably.Realtime({
        authUrl: "/api/create-ably-token",
      });

      setReady(true);
    }
  }, [status, session]);

  if (!ready || !clientRef.current) return null;

  return <AblyProvider client={clientRef.current}>{children}</AblyProvider>;
}
