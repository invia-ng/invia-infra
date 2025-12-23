export function generateRandomChatMessageId(): string {
  let min = 5000;
  let max = 10000;

  min = Math.ceil(min);
  max = Math.floor(max);

  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export function ReferralCodeGenerator(): string {
  const length = 8;
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let referralCode = '';
  const charsetLength = charSet.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    referralCode += charSet[randomIndex];
  }

  return 'LVSX-' + referralCode.toUpperCase();
}

export function VendorIdGenerator(): string {
  let result = 'LVSX-';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function VendorSlugGenerator(lastName: string): string {
  const prefix = 'store';

  const fullName = `${lastName}`.toLowerCase();


  const baseName = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with hyphens
    .replace(/-+/g, '_') // Replace multiple hyphens with single hyphen
    .trim();


  const randomStr = Array.from(
    { length: 5 },
    () =>
      Math.random() < 0.5
        ? String.fromCharCode(97 + Math.floor(Math.random() * 26)) // 'a' to 'z'
        : Math.floor(Math.random() * 10), // '0' to '9'
  ).join('');

  return `${prefix}_${baseName}_${randomStr}`;
}

export function VendorBusinessNameGenerator(firstName: string, lastName: string): string {
  const namePart = firstName || lastName; // Use first name, fallback to last, or default to 'Biz'
  const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1); // Capitalize first letter

  // Add "'s" if it makes sense (excluding names that already end with "s")
  const possessiveName = capitalized.endsWith("s") ? capitalized : `${capitalized}'s`;

  return `${possessiveName} Farm`;
}

export function ProductIdGenerator(): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function GenerateUniqueTrackingNumber(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(2, 4);
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');
  // Generate a random alphanumeric string of 4 characters
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  // Combine year, month, day with the random part for a unique identifier
  return `${year}${month}${day}${randomPart}`;
}
