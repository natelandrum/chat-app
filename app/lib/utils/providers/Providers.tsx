"use client";

import { SessionProvider } from "next-auth/react";
import AblyClientProvider from "@/lib/utils/providers/AblyClientProvider";
import ReduxProvider from "@/lib/utils/providers/ReduxProvider";
import { usePathname } from "next/navigation";
import SessionWatcher from "@/lib/utils/watchers/SessionWatcher";
import GlobalActivityWatcher from "@/lib/utils/watchers/GlobalActivityWatcher";
import QueryProvider from "./QueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = pathname === "/signin"

  return (
    <SessionProvider>
      {isPublicRoute ? (
        children
      ) : (
        <>
          <ReduxProvider>
            <GlobalActivityWatcher />
            <SessionWatcher />
              <AblyClientProvider>
                <QueryProvider>{children}</QueryProvider>
              </AblyClientProvider>
          </ReduxProvider>
        </>
      )}
    </SessionProvider>
  );
}
