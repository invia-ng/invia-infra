export class ProcessPremiumSubscriptionEvent {
  constructor(
    public readonly planId: number,
    public readonly sendNotification: boolean,
    public readonly isBankTransfer: boolean,
    public readonly customerEmail: string,
    public readonly amountPaid: number,
    public readonly paymentReference: string,
  ) {}
}
