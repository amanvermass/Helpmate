"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { startTopLoader, stopTopLoader } from "@/utils/loader";

export default function GlobalTopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Trigger top loader on pathname or searchParams changes (URL change)
  useEffect(() => {
    startTopLoader();
    const timer = setTimeout(() => {
      stopTopLoader();
    }, 350);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Trigger top loader on Browser Back & Forward navigation (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      startTopLoader();
      setTimeout(() => {
        stopTopLoader();
      }, 400);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Intercept clicks on internal links to show progress bar instantly on click
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target
      ) {
        const targetUrl = new URL(anchor.href);
        const currentUrl = new URL(window.location.href);
        if (
          targetUrl.pathname !== currentUrl.pathname ||
          targetUrl.search !== currentUrl.search
        ) {
          startTopLoader();
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleAnchorClick, { capture: true });
  }, []);

  return null;
}
