/**
 * Utility functions for validating dates and time slots to prevent past selection.
 */

/**
 * Checks if an ISO date string (YYYY-MM-DD) is before today.
 */
export function isPastDate(dateISO: string | null | undefined): boolean {
  if (!dateISO) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dateISO.split("-").map((v) => parseInt(v, 10));
  if (parts.length < 3 || parts.some(isNaN)) return false;
  const [year, month, day] = parts;

  const target = new Date(year, month - 1, day);
  target.setHours(0, 0, 0, 0);

  return target < today;
}

/**
 * Checks if a 12-hour time slot string (e.g. "09:00 AM", "02:30 PM") or 24h format
 * is in the past for the given target date (YYYY-MM-DD).
 */
export function isPastTime(
  timeStr: string | null | undefined,
  dateISO: string | null | undefined
): boolean {
  if (!timeStr) return false;

  const effectiveDate = dateISO || new Date().toISOString().split("T")[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = effectiveDate.split("-").map((v) => parseInt(v, 10));
  if (parts.length < 3 || parts.some(isNaN)) return false;
  const [year, month, day] = parts;

  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  // If date is before today -> entire time is past
  if (targetDate < today) return true;

  // If date is in the future -> time is not past
  if (targetDate > today) return false;

  // Date is TODAY -> compare time against current local time
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return false;

  let [_, h, m, period] = match;
  let hour = parseInt(h, 10);
  const minute = parseInt(m, 10);

  if (period) {
    period = period.toUpperCase();
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
  }

  const slotTime = new Date();
  slotTime.setHours(hour, minute, 0, 0);

  const now = new Date();
  // Slot start time at or before current time is considered past
  return slotTime <= now;
}
