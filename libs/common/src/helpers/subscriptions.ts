export function calculateSubscriptionExpirationDate(
  duration: number,
  duration_bonus: number,
): Date {
  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() + (duration + duration_bonus));

  return currentDate;
}

export function isDateExpired(date: Date): boolean {
  const today = new Date();

  // Zero out the time part for an accurate date-only comparison
  today.setHours(0, 0, 0, 0);

  return today > date;
}

export function calculateExpirationDateByYear(fromDate: Date): Date {
  const expirationDate = new Date(fromDate);

  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  return expirationDate;
}

export function generateSubscriptionExpirationInfo(expirationDate: Date): string {
  if (isDateExpired(expirationDate)) {
    return 'Renew plan. Your plan has expired. Renew now to regain full access to your account and features.';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);

  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 14) {
    return `Renew plan. Your plan expires in ${diffDays} day${diffDays === 1 ? '' : 's'}. Renew to avoid losing access.`;
  }

  return '';
}