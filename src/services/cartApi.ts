const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface ApiCartAddon {
  addonId: string;
  addonName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface ApiCartItem {
  itemId: string;
  package: {
    _id: string;
    packageName: string;
    price: number;
    duration: number;
  };
  quantity: number;
  packageTotal: number;
  selectedAddons: ApiCartAddon[];
}

export interface ApiCartPricing {
  itemsSubtotal: number;
  addonSubtotal: number;
  subtotal: number;
  gstRate: number;
  gst: number;
  convenienceFee: number;
  grandTotal: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data?: {
    cartId?: string | null;
    items?: ApiCartItem[];
    totalItems?: number;
    itemCount?: number;
    pricing?: ApiCartPricing;
    cart?: any;
  };
}

export async function addToCartApi(
  token: string,
  packageId: string,
  quantity: number = 1
): Promise<CartResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ packageId, quantity }),
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add package to cart.",
    };
  }
}

export async function getCartApi(token: string): Promise<CartResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch cart.",
    };
  }
}

export async function updateCartItemApi(
  token: string,
  itemId: string,
  quantity: number
): Promise<CartResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/cart/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update cart item.",
    };
  }
}

export async function removeCartItemApi(
  token: string,
  itemId: string
): Promise<CartResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to remove item from cart.",
    };
  }
}

export async function clearCartApi(token: string): Promise<CartResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to clear cart.",
    };
  }
}

export async function updateCartAddonApi(
  token: string,
  itemId: string,
  addonId: string,
  action: "add" | "remove"
): Promise<CartResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/cart/${itemId}/addons`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ addonId, action }),
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update cart addon.",
    };
  }
}
