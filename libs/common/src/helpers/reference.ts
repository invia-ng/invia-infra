type TransactionReferenceTypes =
  | 'premium_subscription' | 'invite_guests_billing';

function makeTransactionReference(source: TransactionReferenceTypes): string {
  const PREMIUM_PREFIX = 'INVIA_PREM';
  const INVITE_GUESTS_BILLING_PREFIX = 'INVIA_INVITE';
  const timestamp = getTimeStampID();

  if (source === 'premium_subscription') {
    return `${PREMIUM_PREFIX}-${timestamp}`;
  }

  if (source === 'invite_guests_billing') {
    return `${INVITE_GUESTS_BILLING_PREFIX}-${timestamp}`;
  }

  return `${PREMIUM_PREFIX}-${timestamp}`; // default fallback
}

function getTimeStampID(): string {
  const date = new Date();
  const yy = date.getFullYear().toString().slice(-2);
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');

  // Generate 4 random characters (letters and numbers)
  const randomChars = Math.random()
    .toString(36)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4);

  return `${yy}${mm}${dd}${randomChars}`;
}

function parseTransactionReferenceType(
  reference: string,
): TransactionReferenceTypes {
  if (reference.includes('INVIA_PREM')) {
    return 'premium_subscription';
  }

  if (reference.includes('INVIA_INVITE')) {
    return 'invite_guests_billing';
  }

  return 'premium_subscription'; // default fallback
}

function getKeyFromTransactionReference(reference: string) {
  return reference.split('-')[1];
}

export const TransactionRefHelpers = {
  makeTransactionReference,
  parseTransactionReferenceType,
  getKeyFromTransactionReference,
  getTimeStampID,
};
