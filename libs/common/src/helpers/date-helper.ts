export const META_RETRY_ERROR_CODE = 131049;
export const META_RETRY_DELAY_HOURS = 24;

export const getNextRetryAt = (from: Date): Date => {
  const nextRetryAt = new Date(from);
  nextRetryAt.setHours(nextRetryAt.getHours() + META_RETRY_DELAY_HOURS);
  return nextRetryAt;
};
