const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

// In-memory cache for ultra-fast API response
const memoryCache = new Map<string, any>();

export interface CategoryItem {
  _id: string;
  categoryName: string;
  iconUrl?: string;
  slug?: string;
}

export interface SubCategoryItem {
  _id: string;
  name: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data?: CategoryItem[];
}

export interface SubCategoriesResponse {
  success: boolean;
  message: string;
  data?: SubCategoryItem[];
}

export async function fetchCustomerCategoriesApi(): Promise<CategoriesResponse> {
  const cacheKey = "categories";
  
  // Return cached result instantly if available
  if (memoryCache.has(cacheKey)) {
    // Background refresh
    fetch(`${API_BASE_URL}/api/customer/categories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then(res => res.json()).then(data => {
      if (data && data.success) memoryCache.set(cacheKey, data);
    }).catch(() => {});
    
    return memoryCache.get(cacheKey);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch categories.",
      };
    }

    if (data && data.success) {
      memoryCache.set(cacheKey, data);
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error while fetching categories.",
    };
  }
}

export async function fetchCustomerSubCategoriesApi(categoryId: string): Promise<SubCategoriesResponse> {
  const cacheKey = `subcategories_${categoryId}`;

  if (memoryCache.has(cacheKey)) {
    fetch(`${API_BASE_URL}/api/customer/subcategories?categoryId=${encodeURIComponent(categoryId)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then(res => res.json()).then(data => {
      if (data && data.success) memoryCache.set(cacheKey, data);
    }).catch(() => {});

    return memoryCache.get(cacheKey);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/subcategories?categoryId=${encodeURIComponent(categoryId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch subcategories.",
      };
    }

    if (data && data.success) {
      memoryCache.set(cacheKey, data);
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error while fetching subcategories.",
    };
  }
}
