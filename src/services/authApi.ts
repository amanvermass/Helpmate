const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface RegisterPayload {
  fullName: string;
  mobile: string;
  password: string;
}

export interface LoginPayload {
  mobile: string;
  password: string;
}

export interface CustomerData {
  id: string;
  customerCode: string;
  fullName: string;
  mobile: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    customer: CustomerData;
    token: string;
  };
}

export async function registerCustomerApi(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Registration failed. Please try again.",
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error. Unable to connect to server.",
    };
  }
}

export async function loginCustomerApi(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Login failed. Please check credentials.",
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error. Unable to connect to server.",
    };
  }
}

export interface CurrentCustomerResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    customerCode: string;
    fullName: string;
    mobile: string;
    email?: string;
    customerCategory?: string;
    propertyHouseholdType?: string;
  };
}

/**
 * Fetch authenticated customer profile using JWT Bearer token
 * GET /api/customer/auth/me
 */
export async function getCurrentCustomerApi(token: string): Promise<CurrentCustomerResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch customer profile.",
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Network error while fetching profile.",
    };
  }
}
