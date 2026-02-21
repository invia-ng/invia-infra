/**
 * Parses a string to replace spaces with underscores and remove special characters
 * @param input - The input string to process
 * @returns The processed string with spaces replaced by underscores and special characters removed
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return (
    input
      // Remove special characters, keeping only alphanumeric characters, spaces, hyphens, and underscores
      .replace(/[^a-zA-Z0-9\s\-_]/g, '')
      // Replace one or more consecutive spaces with a single underscore
      .replace(/\s+/g, '_')
      // Remove leading and trailing underscores
      .replace(/^_+|_+$/g, '')
      // Convert to lowercase for consistency
      .toLowerCase()
  );
}

/**
 * Similar to sanitizeString but preserves case
 * @param input - The input string to process
 * @returns The processed string with spaces replaced by underscores and special characters removed
 */
export function sanitizeStringPreserveCase(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return (
    input
      // Remove special characters, keeping only alphanumeric characters and spaces
      .replace(/[^a-zA-Z0-9\s]/g, '')
      // Replace one or more consecutive spaces with a single underscore
      .replace(/\s+/g, '_')
      // Remove leading and trailing underscores
      .replace(/^_+|_+$/g, '')
  );
}

/**
 * Masks an email address
 * @param email - The email address to mask
 * @returns The masked email address
 */
export function maskEmailAddress(email: string): string {
  if (!email) return email;
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const masked = local.charAt(0) + '*'.repeat(Math.max(local.length - 1, 5));
  return `${masked}@${domain}`;
}

/**
 * Masks a phone number
 * @param phone - The phone number to mask
 * @returns The masked phone number
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return phone;
  // Detect country code: +<digits> (1–4 digits) at the start
  const ccMatch = phone.match(/^(\+\d{1,4})/);
  if (ccMatch) {
    const cc = ccMatch[1];
    const rest = phone.slice(cc.length);
    return `${cc}${'*'.repeat(rest.length)}`;
  }
  // No country code — mask everything except the first digit
  return phone.charAt(0) + '*'.repeat(phone.length - 1);
}
