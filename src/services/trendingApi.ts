const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface TrendingPackageItem {
  packageId: string;
  packageName: string;
  subtitle?: string;
  description?: string;
  category?: {
    id: string;
    name: string;
  };
  subCategory?: {
    id: string;
    name: string;
  };
  serviceAction?: {
    id: string;
    name: string;
  };
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  duration?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  isBookmarked?: boolean;
  displayOrder?: number;
}

export interface TrendingPackagesResponse {
  success: boolean;
  message: string;
  data?: TrendingPackageItem[];
}

const memoryCache = new Map<string, any>();

/**
 * Fetch website trending packages for customer.
 * GET /api/customer/trending
 */
export async function fetchCustomerTrendingApi(
  token?: string | null
): Promise<TrendingPackagesResponse> {
  const cacheKey = `trending_${token || "guest"}`;
  if (memoryCache.has(cacheKey)) {
    // Refresh background
    const bgHeaders: Record<string, string> = { "Content-Type": "application/json" };
    if (token) bgHeaders["Authorization"] = `Bearer ${token}`;
    fetch(`${API_BASE_URL}/api/customer/trending`, { method: "GET", headers: bgHeaders })
      .then(res => res.json())
      .then(data => { if (data && data.success) memoryCache.set(cacheKey, data); })
      .catch(() => {});

    return memoryCache.get(cacheKey);
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/customer/trending`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    if (data && data.success) {
      memoryCache.set(cacheKey, data);
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching customer trending packages:", error);
    return {
      success: false,
      message: error?.message || "Failed to fetch trending packages.",
    };
  }
}
