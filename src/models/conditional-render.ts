import { toBool } from '../utilities/string-util';

export class ConditionalRender {
  public selector: string;
  public value: boolean;

  public constructor(json: string) {
    this.fromString(json);
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