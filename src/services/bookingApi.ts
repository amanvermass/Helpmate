const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface CreateBookingPayload {
  addressId: string;
  bookingDate: string;
  timeSlot: string;
  paymentMethod: "pay_after_service" | string;
}

export interface CreateBookingResponseData {
  bookingId: string;
  bookingNumber: string;
  status: string;
  payment: {
    paymentMethod: string;
    paymentStatus: string;
  };
  schedule: {
    bookingDate: string;
    timeSlot: string;
  };
  totalAmount: number;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data?: CreateBookingResponseData;
}

/**
 * Creates a new website booking for the customer.
 * POST /api/customer/bookings
 */
export async function createBookingApi(
  payload: CreateBookingPayload,
  token?: string | null
): Promise<CreateBookingResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/customer/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Create Booking API error:", error);
    return {
      success: false,
      message: error?.message || "Network error. Failed to create booking.",
    };
  }
}

export interface CustomerBookingHistoryItem {
  bookingId: string;
  bookingNumber: string;
  bookingDate: string | null;
  timeSlot: string;
  status: string;
  amount: number;
  serviceVariant: string;
  services: Array<{
    category?: { id: string; name: string } | null;
    subCategory?: { id: string; name: string } | null;
    serviceAction?: { id: string; name: string } | null;
    package?: { id: string; name: string; price: number; duration: number } | null;
    quantity: number;
    totalPrice: number;
  }>;
  createdAt: string;
}

export interface CustomerBookingHistoryResponse {
  success: boolean;
  message: string;
  data?: CustomerBookingHistoryItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch customer booking history list.
 * GET /api/customer/bookings
 */
export async function fetchCustomerBookingsApi(
  token?: string | null,
  page: number = 1,
  limit: number = 20,
  status?: string
): Promise<CustomerBookingHistoryResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (status) queryParams.append("status", status);

    const response = await fetch(`${API_BASE_URL}/api/customer/bookings?${queryParams.toString()}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Fetch Customer Bookings API error:", error);
    return {
      success: false,
      message: error?.message || "Failed to fetch booking history.",
    };
  }
}
