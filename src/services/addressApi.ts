const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

import { Address, AddressRecipientType } from "@/store/useStore";

export interface BackendLocality {
  _id: string;
  localityName: string;
  pincode: string;
  status: boolean;
}

export interface BackendAddress {
  _id: string;
  customerId: string;
  addressLabel: string;
  relationshipType: "self" | "family_member" | "friend_neighbor" | "office_work" | "other_person";
  localityId: BackendLocality | string;
  pincode: string;
  serviceAddress: string;
  landmark?: string;
  isPrimary: boolean;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressPayload {
  addressLabel: string;
  relationshipType: "self" | "family_member" | "friend_neighbor" | "office_work" | "other_person";
  localityId: string;
  pincode: string;
  serviceAddress: string;
  landmark?: string;
  isPrimary?: boolean;
}

export interface UpdateAddressPayload extends Partial<CreateAddressPayload> {}

export interface AddressApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// 1. Get Logged-In Customer's Addresses
export async function getCustomerAddressesApi(token: string): Promise<AddressApiResponse<BackendAddress[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/addresses`, {
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
      message: error.message || "Failed to fetch addresses.",
    };
  }
}

// 2. Add New Customer Address
export async function addCustomerAddressApi(
  token: string,
  payload: CreateAddressPayload
): Promise<AddressApiResponse<BackendAddress>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add address.",
    };
  }
}

// 3. Update Customer Address
export async function updateCustomerAddressApi(
  token: string,
  addressId: string,
  payload: UpdateAddressPayload
): Promise<AddressApiResponse<BackendAddress>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/addresses/${addressId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update address.",
    };
  }
}

// 4. Delete Customer Address
export async function deleteCustomerAddressApi(
  token: string,
  addressId: string
): Promise<AddressApiResponse<void>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customer/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete address.",
    };
  }
}

// 5. Fetch Localities
export async function getLocalitiesApi(): Promise<AddressApiResponse<{ localities: BackendLocality[] }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/locality?limit=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch localities.",
    };
  }
}

// Mapping Utilities
export const mapRelationshipToFrontend = (rel?: string): AddressRecipientType => {
  switch (rel) {
    case "family_member":
      return "Family Member";
    case "friend_neighbor":
      return "Friend / Neighbor";
    case "office_work":
      return "Office / Work";
    case "other_person":
      return "Other";
    case "self":
    default:
      return "Self";
  }
};

export const mapRelationshipToBackend = (
  rel?: string
): "self" | "family_member" | "friend_neighbor" | "office_work" | "other_person" => {
  switch (rel) {
    case "Family Member":
      return "family_member";
    case "Friend / Neighbor":
      return "friend_neighbor";
    case "Office / Work":
      return "office_work";
    case "Other":
      return "other_person";
    case "Self":
    default:
      return "self";
  }
};

export const mapBackendAddressToFrontend = (bAddr: BackendAddress): Address => {
  const localityObj = typeof bAddr.localityId === "object" ? bAddr.localityId : null;
  const localityName = localityObj?.localityName || "Sigra";
  const localityIdStr = localityObj?._id || (typeof bAddr.localityId === "string" ? bAddr.localityId : "");

  return {
    id: bAddr._id,
    tag: bAddr.addressLabel || "Home",
    recipientType: mapRelationshipToFrontend(bAddr.relationshipType),
    locality: localityName,
    localityId: localityIdStr,
    pincode: bAddr.pincode || localityObj?.pincode || "221002",
    landmark: bAddr.landmark || "",
    addressLine: bAddr.serviceAddress,
    city: "Varanasi",
    isDefault: bAddr.isPrimary || false,
  };
};
