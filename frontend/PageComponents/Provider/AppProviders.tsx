"use client";
/* ==========  frontend/PageComponents/Provider/AppProviders.tsx  ===============*/

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import AxiosProvider from "@/PageComponents/Provider/AxiosProvider";
import { useAuthStore } from "@/stores/authStore";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const setHasHydrated = useAuthStore((state) => state.setHasHydrated);

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  return (
    <QueryClientProvider client={queryClient}>
      <AxiosProvider>{children}</AxiosProvider>
    </QueryClientProvider>
  );
}
