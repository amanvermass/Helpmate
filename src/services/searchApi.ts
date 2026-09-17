const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface SearchSuggestionItem {
  packageId: string;
  packageName: string;
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
  duration?: number;
  imageUrl?: string;
}

export interface SearchSuggestionsResponse {
  success: boolean;
  message: string;
  data?: SearchSuggestionItem[];
}

export async function fetchCustomerSearchSuggestionsApi(
  search: string,
  limit: number = 5
): Promise<SearchSuggestionsResponse> {
  try {
    if (!search.trim()) {
      return { success: true, message: "Empty search query", data: [] };
    }

    const res = await fetch(
      `${API_BASE_URL}/api/customer/search/suggestions?search=${encodeURIComponent(search.trim())}&limit=${limit}`,
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
        message: data.message || "Failed to fetch search suggestions.",
      };
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching search suggestions:", error);
    return {
      success: false,
      message: error.message || "Network error while fetching search suggestions.",
    };
  }
}
