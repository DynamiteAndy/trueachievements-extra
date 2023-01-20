import { toBool } from '../utilities/string-util';

export class ConditionalRender {
  public selector: string;
  public checked: boolean;
  public value: string[];

  public constructor(json: string) {
    this.fromString(json);
  }

  fromString(json: string): void {
    try {
      const parsedObj = JSON.parse(json);
    
      this.selector = parsedObj.selector;
      this.checked = parsedObj.checked ? toBool(parsedObj.checked) : null;
      this.value = parsedObj.value ? parsedObj.value.split(',') : null;
    } catch (e) {
      this.selector = null;
      this.checked = null;
      this.value = null;
    }
  }

  isValid(): boolean {
    return this.selector !== null && (this.checked !== null || this.value !== null);
  }

  toString(): string {
    return JSON.stringify(this);
  }
}