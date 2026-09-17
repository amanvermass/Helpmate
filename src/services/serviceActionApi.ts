const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface ServiceActionItem {
  _id: string;
  serviceAction: string;
}

export interface PackageAddon {
  _id: string;
  title: string;
  price: number;
  unit?: string;
}

export interface PackageItem {
  _id: string;
  packageName: string;
  subtitle?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  duration: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  addons?: PackageAddon[];
}

export interface ServiceActionsResponse {
  success: boolean;
  message: string;
  data?: ServiceActionItem[];
}

export interface PackagesResponse {
  success: boolean;
  message: string;
  data?: PackageItem[];
}

const memoryCache = new Map<string, any>();

export async function fetchCustomerServiceActionsApi(
  categoryId: string,
  subCategoryId?: string
): Promise<ServiceActionsResponse> {
  const cacheKey = `actions_${categoryId}_${subCategoryId || "none"}`;
  if (memoryCache.has(cacheKey)) {
    let url = `${API_BASE_URL}/api/customer/service-actions?categoryId=${encodeURIComponent(categoryId)}`;
    if (subCategoryId) url += `&subCategoryId=${encodeURIComponent(subCategoryId)}`;
    fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } })
      .then(r => r.json())
      .then(d => { if (d && d.success) memoryCache.set(cacheKey, d); })
      .catch(() => {});

    return memoryCache.get(cacheKey);
  }

  try {
    let url = `${API_BASE_URL}/api/customer/service-actions?categoryId=${encodeURIComponent(categoryId)}`;
    if (subCategoryId) {
      url += `&subCategoryId=${encodeURIComponent(subCategoryId)}`;
    }
    const res = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch service actions.",
      };
    }

    if (data && data.success) {
      memoryCache.set(cacheKey, data);
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error while fetching service actions.",
    };
  }
}

export async function fetchCustomerPackagesApi(
  serviceActionId: string
): Promise<PackagesResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/customer/packages?serviceActionId=${encodeURIComponent(serviceActionId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch packages.",
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error while fetching packages.",
    };
  }
}
