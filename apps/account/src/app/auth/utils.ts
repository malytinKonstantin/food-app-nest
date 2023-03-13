export const getTimeLimitByRetry = (retryCount: number) => {
  if (retryCount <= 2) {
    return 60;
  }
  if (retryCount === 3) {
    return 60 * 5;
  }
  if (retryCount === 4) {
    return 60 * 15;
  }
};
