import { isTAXChildListElement, isTAXListElement } from '@ta-x-utilities';

export class ListSetting {
  public parent: HTMLElement;
  public list: HTMLUListElement;
  public input: HTMLInputElement;
  public listId: string;
  public values: string[];

  public constructor(element: HTMLElement) {
    if (isTAXChildListElement(element)) {
      this.parent = element.closest('.frm-lst');
    } else if (isTAXListElement(element)) {
      this.parent = element;
    }

    this.listId = this.parent.getAttribute('data-list-id');
    this.list = this.parent.querySelector(`#${this.listId}`);
    this.input = this.parent.querySelector(`#${this.listId}-input`);
  }
}