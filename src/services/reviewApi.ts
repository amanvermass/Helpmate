const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface CreateReviewPayload {
  bookingId: string;
  packageId?: string;
  rating: number;
  review?: string;
  video?: File | null;
}

export interface UpdateReviewPayload {
  rating?: number;
  review?: string;
  video?: File | null;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function createReviewApi(
  token: string,
  payload: CreateReviewPayload
): Promise<ReviewResponse> {
  try {
    const formData = new FormData();
    formData.append("bookingId", payload.bookingId);
    if (payload.packageId) {
      formData.append("packageId", payload.packageId);
    }
    formData.append("rating", payload.rating.toString());
    if (payload.review) {
      formData.append("review", payload.review);
    }
    if (payload.video) {
      formData.append("video", payload.video);
    }

    const res = await fetch(`${API_BASE_URL}/api/customer/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to submit review.",
      };
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error while submitting review.",
    };
  }
}

export async function updateReviewApi(
  token: string,
  reviewId: string,
  payload: UpdateReviewPayload
): Promise<ReviewResponse> {
  try {
    const formData = new FormData();
    if (payload.rating !== undefined) {
      formData.append("rating", payload.rating.toString());
    }
    if (payload.review !== undefined) {
      formData.append("review", payload.review);
    }
    if (payload.video) {
      formData.append("video", payload.video);
    }

    const res = await fetch(`${API_BASE_URL}/api/customer/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update review.",
      };
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error while updating review.",
    };
  }
}

export async function fetchCustomerReviewsApi(
  packageId?: string,
  token?: string
): Promise<ReviewResponse> {
  try {
    let url = `${API_BASE_URL}/api/customer/reviews`;
    if (packageId) {
      url += `?packageId=${encodeURIComponent(packageId)}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch reviews.",
      };
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error while fetching reviews.",
    };
  }
}

export const getReviewsApi = fetchCustomerReviewsApi;

export async function deleteReviewApi(
  token: string,
  reviewId: string
): Promise<ReviewResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete review.",
      };
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error while deleting review.",
    };
  }
}
