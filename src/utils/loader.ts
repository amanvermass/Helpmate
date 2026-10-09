import NProgress from "nprogress";

// Configure NProgress globally
if (typeof window !== "undefined") {
  NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.15,
    speed: 300,
  });
}

/**
 * Start the top progress loader bar (call at beginning of data fetching on any page)
 */
export const startTopLoader = () => {
  if (typeof window !== "undefined") {
    NProgress.start();
  }
};

/**
 * Stop/complete the top progress loader bar (call when data fetching completes)
 */
export const stopTopLoader = () => {
  if (typeof window !== "undefined") {
    NProgress.done();
  }
};
