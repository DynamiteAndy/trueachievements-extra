import type { MemoizedFetchOptions } from '@ta-x-types';

export class MemoizedFetch {
  public expiryTime: Date;
  public response: string;

  public constructor(opts?: MemoizedFetchOptions) {
    const options = opts ? opts : { deleteAfter: { value: 7, period: 'days' } };
    const now = new Date();

    switch (options.deleteAfter.period) {
      case 'seconds':
        this.expiryTime = new Date(now.setSeconds(now.getSeconds() + options.deleteAfter.value));
        break;

      case 'minutes':
        this.expiryTime = new Date(now.setMinutes(now.getMinutes() + options.deleteAfter.value));
        break;

      case 'hours':
        this.expiryTime = new Date(now.setHours(now.getHours() + options.deleteAfter.value));
        break;

      case 'days':
        this.expiryTime = new Date(now.setDate(now.getDate() + options.deleteAfter.value));
        break;
    }
  }

  setResponse(response: string): MemoizedFetch {
    this.response = response;
    return this;
  }

  fromString(json: string): void {
    try {
      const parsedObj = JSON.parse(json) as MemoizedFetch;

      this.expiryTime = parsedObj.expiryTime;
      this.response = parsedObj.response;
    } catch {
      // Do nothing
    }
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
