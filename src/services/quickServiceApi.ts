const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface QuickServiceItem {
  _id?: string;
  packageId?: string;
  id?: string;
  packageName: string;
  price: number;
  originalPrice?: number;
  duration?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  category?: string | { id?: string; name?: string };
  categoryName?: string;
  categoryId?: string;
  categorySlug?: string;
}

export interface QuickServicesResponse {
  success: boolean;
  message: string;
  data?: QuickServiceItem[];
}

/**
 * Fetch website quick services configured in admin from GET /api/quick-services
 */
export async function fetchCustomerQuickServicesApi(): Promise<QuickServicesResponse> {
  const url = `${API_BASE_URL}/api/quick-services`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to fetch quick services.",
      };
    }
    return data;
  } catch (error: any) {
    // Fallback through relative Next.js proxy route /api/quick-services
    try {
      const fallbackRes = await fetch("/api/quick-services", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const fallbackData = await fallbackRes.json();
      return fallbackData;
    } catch {
      return {
        success: false,
        message: error?.message || "Network error while fetching quick services.",
      };
    }
  }
}
