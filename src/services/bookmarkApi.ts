const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface BookmarkedPackage {
  _id: string;
  packageName: string;
  subtitle?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  duration?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  serviceAction?: {
    _id: string;
    name: string;
    categoryId?: string;
    subCategoryId?: string;
  };
  addons?: Array<any>;
}

export interface BookmarkItem {
  bookmarkId: string;
  package: BookmarkedPackage;
  createdAt?: string;
}

export interface BookmarkApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
}

// 1. Get Customer Bookmarks
export async function getBookmarksApi(token: string): Promise<BookmarkApiResponse<BookmarkItem[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/bookmarks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch bookmarks.",
    };
  }
}

// 2. Add Package to Bookmarks
export async function addBookmarkApi(
  token: string,
  packageId: string
): Promise<BookmarkApiResponse<{ bookmarkId?: string; packageId: string; isBookmarked: boolean }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/bookmarks/${packageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to bookmark package.",
    };
  }
}

// 3. Remove Package from Bookmarks
export async function removeBookmarkApi(
  token: string,
  packageId: string
): Promise<BookmarkApiResponse<{ packageId: string; isBookmarked: boolean }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/bookmarks/${packageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to remove bookmark.",
    };
  }
}

// 4. Toggle Package Bookmark
export async function toggleBookmarkApi(
  token: string,
  packageId: string,
  currentlyBookmarked: boolean
): Promise<BookmarkApiResponse> {
  if (currentlyBookmarked) {
    return removeBookmarkApi(token, packageId);
  } else {
    return addBookmarkApi(token, packageId);
  }
}
