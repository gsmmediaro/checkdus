/**
 * Validates phone number format
 * Accepts formats like: (555) 123-4567, 555-123-4567, 5551234567, +1 555 123 4567
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if it's a valid US phone number (10 or 11 digits with optional +1)
  return digitsOnly.length === 10 || digitsOnly.length === 11;
}

/**
 * Formats phone number to (XXX) XXX-XXXX format
 */
export function formatPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11) {
    return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }

  return phone;
}

/**
 * Formats currency to USD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Formats duration in minutes to human-readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Converts 24-hour time (HH:mm) to 12-hour AM/PM format
 * @param time24 - Time in 24-hour format (e.g., "14:30", "09:00")
 * @returns Time in 12-hour format (e.g., "2:30 PM", "9:00 AM")
 */
export function formatTime12Hour(time24: string): string {
  if (!time24) return '';

  const [hours24, minutes] = time24.split(':').map(Number);

  if (isNaN(hours24) || isNaN(minutes)) return time24;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12; // Convert 0 to 12 for midnight

  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Converts 12-hour AM/PM time to 24-hour format (HH:mm)
 * @param time12 - Time in 12-hour format (e.g., "2:30 PM", "9:00 AM")
 * @returns Time in 24-hour format (e.g., "14:30", "09:00")
 */
export function formatTime24Hour(time12: string): string {
  if (!time12) return '';

  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12;

  let [, hours, minutes, period] = match;
  let hours24 = parseInt(hours, 10);

  if (period.toUpperCase() === 'PM' && hours24 !== 12) {
    hours24 += 12;
  } else if (period.toUpperCase() === 'AM' && hours24 === 12) {
    hours24 = 0;
  }

  return `${hours24.toString().padStart(2, '0')}:${minutes}`;
}
