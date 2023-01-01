import { toBool } from '../utilities/string-util';

export class ConditionalRender {
  public selector: string;
  public value: boolean;

  public constructor();
  public constructor(json: string);
  public constructor(...params: any[]) {
    if (params.length === 1) {
      this.fromString(params[0] as string);
      return;
    }
  }

  fromString(json: string): void {
    try {
      const parsedObj = JSON.parse(json) as ConditionalRender;
    
      this.selector = parsedObj.selector;
      this.value = toBool(parsedObj.value);
    } catch (e) {
      // Do nothing
    }
  }

  isValid(): boolean {
    return this.selector != null && this.value != null;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}