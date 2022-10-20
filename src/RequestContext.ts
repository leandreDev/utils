export class RequestContext {
  public null: null = null;

  public emptyStr: string = '';

  get now(): number {
    return Date.now();
  }

  get DateNow(): Date {
    return new Date();
  }
}
