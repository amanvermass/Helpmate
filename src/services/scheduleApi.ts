const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export interface ScheduleDate {
  date: string;
  day: string;
  available: boolean;
}

export interface ScheduleTimeSlot {
  startTime: string;
  endTime: string;
  value: string;
}

export interface ScheduleAvailabilityData {
  bookingWindow: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
  slotConfiguration: {
    startTime: number;
    endTime: number;
    slotDuration: number;
  };
  dates: ScheduleDate[];
  timeSlots: ScheduleTimeSlot[];
}

export interface ScheduleAvailabilityResponse {
  success: boolean;
  message: string;
  data?: ScheduleAvailabilityData;
}

export async function fetchScheduleAvailabilityApi(token?: string | null): Promise<ScheduleAvailabilityResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/customer/schedule/availability`, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch schedule availability.",
    };
  }
}
