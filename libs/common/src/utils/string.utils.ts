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
