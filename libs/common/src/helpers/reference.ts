type TransactionReferenceTypes =
  | 'premium_subscription';

function makeTransactionReference(source: TransactionReferenceTypes): string {
  const PREMIUM_PREFIX = 'INVIA_PREM';
  const timestamp = getTimeStampID();

  if (source === 'premium_subscription') {
    return `${PREMIUM_PREFIX}-${timestamp}`;
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
