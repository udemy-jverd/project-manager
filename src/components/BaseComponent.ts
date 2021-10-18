abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement> {
  private templateElement: HTMLTemplateElement;
  private hostElement: T;
  protected element: U;

  constructor(
    templateId: string,
    hostElement: string,
    insertAtStart: boolean,
    newElementId?: string,
  ) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElement)! as T;

    const node = document.importNode(this.templateElement.content, true);
    this.element = node.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend',
      this.element,
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

export default BaseComponent;
