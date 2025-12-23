export class FetchReferralSourceQuery {
  constructor() {}
}

export class FetchAvailableStatesQuery {
  constructor() {}
}

export class FetchAvailableCitiesQuery {
  constructor(public readonly state: string) {}
}
