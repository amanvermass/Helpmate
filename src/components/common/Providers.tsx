"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import { useRouter, usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  }));
  
  const theme = useStore((state) => state.theme);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted && !isLoggedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [mounted, isLoggedIn, pathname, router]);

  // Prevent flash during hydration
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  // If not logged in and not on login page, we can also prevent rendering the main content to avoid flicker
  if (!isLoggedIn && pathname !== "/login") {
    return null; // The useEffect will handle the redirect
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
