export function GenerateSendEmailTimeout(toEmailsLength: number): number {
  if (toEmailsLength <= 10) {
    return 70 * 1000;
  } else if (toEmailsLength <= 50) {
    return 120 * 1000;
  } else if (toEmailsLength <= 100) {
    return 180 * 1000;
  } else if (toEmailsLength <= 200) {
    return 240 * 1000;
  } else {
    return 280 * 1000;
  }
}
