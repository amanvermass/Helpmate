const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface InvoiceAddon {
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface InvoiceItem {
  categoryName?: string;
  subCategoryName?: string;
  serviceActionName?: string;
  packageName: string;
  quantity: number;
  unitPrice: number;
  selectedAddons?: InvoiceAddon[];
  totalPrice: number;
}

export interface InvoiceAddress {
  addressLabel: string;
  localityName: string;
  pincode: string;
  serviceAddress: string;
  landmark?: string;
}

export interface InvoiceCustomer {
  customerId: string;
  name: string;
  mobile: string;
}

export interface InvoiceBilling {
  mrp: number;
  sellingPrice: number;
  discount: number;
  platformFee: number;
  gst: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | string;
}

export interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  bookingId: string;
  bookingNumber: string;
  customer: InvoiceCustomer;
  address: InvoiceAddress;
  items: InvoiceItem[];
  billing: InvoiceBilling;
  invoiceStatus: "generated" | "cancelled" | string;
  generatedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FetchInvoiceResponse {
  success: boolean;
  message: string;
  data?: InvoiceData;
}

/**
 * Fetch invoice details by booking ID or invoice ID.
 * GET /api/website/invoices/:bookingId
 */
export async function fetchInvoiceApi(
  bookingId: string,
  token?: string | null
): Promise<FetchInvoiceResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // First try website route, fallback to customer route if needed
    const response = await fetch(`${API_BASE_URL}/api/customer/invoices/${bookingId}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Fetch Invoice API error:", error);
    return {
      success: false,
      message: error?.message || "Failed to fetch invoice details.",
    };
  }
}

/**
 * Fetch and download PDF for invoice.
 * GET /api/website/invoices/:bookingId/pdf
 */
export async function fetchInvoicePdfBlob(
  bookingId: string,
  token?: string | null
): Promise<Blob | null> {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/customer/invoices/${bookingId}/pdf`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to download PDF (${response.status})`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Fetch Invoice PDF error:", error);
    return null;
  }
}
