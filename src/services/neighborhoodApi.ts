const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface NeighborhoodZoneItem {
  _id: string;
  zoneName: string;
  city: string;
  proCount: number;
  sortOrder: number;
  areasCovered: string[];
  imageUrl: string;
}

export interface NeighborhoodZonesResponse {
  success: boolean;
  message: string;
  data?: NeighborhoodZoneItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const memoryCache = new Map<string, any>();

export async function fetchCustomerNeighborhoodZonesApi(): Promise<NeighborhoodZonesResponse> {
  const cacheKey = "neighborhood_zones";
  if (memoryCache.has(cacheKey)) {
    fetch(`${API_BASE_URL}/api/customer/neighborhood-zones`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => { if (data && data.success) memoryCache.set(cacheKey, data); })
      .catch(() => {});

    return memoryCache.get(cacheKey);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/neighborhood-zones`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch neighborhood zones.",
      };
    }

    if (data && data.success) {
      memoryCache.set(cacheKey, data);
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error while fetching neighborhood zones.",
    };
  }
}
