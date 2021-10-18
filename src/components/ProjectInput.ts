import BaseComponent from './BaseComponent.js';
import IValidatable from '../interfaces/validation.js';
import isValid from '../utils/validation.js';
import projectState from '../states/ProjectState.js';

class ProjectInput extends BaseComponent<HTMLDivElement, HTMLFormElement> {
  private titleInputEl: HTMLInputElement;
  private descriptionInputEl: HTMLInputElement;
  private peopleInput: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
    this.titleInputEl = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputEl = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInput = this.element.querySelector('#people') as HTMLInputElement;
    this.configure();
  }

  public configure(): void {
    this.element.addEventListener('submit', this.submitHandler);
  }

  /* eslint-disable class-methods-use-this */
  public renderContent(): void {}

  private retrieveUserInputs(): [string, string, number] | [] {
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const peopleAmount = this.peopleInput.value;

    const titleProps: IValidatable = {
      value: title,
      required: true,
    };
    const descProps: IValidatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    const peopleProps: IValidatable = {
      value: peopleAmount,
      required: true,
      minValue: 1,
      maxValue: 5,
    };

    if (!isValid(titleProps) && !isValid(descProps) && !isValid(peopleProps)) {
      /* eslint-disable no-alert */
      alert('Invalid input, please try again!');
      return [];
    }
    return [title, description, +peopleAmount];
  }

  // () => used to access to `this` as the current class and not to the event
  private submitHandler = (event: Event) => {
    event.preventDefault();
    const userInputs = this.retrieveUserInputs();
    if (userInputs.length !== 0) {
      const [title, description, peopleAmout] = userInputs;
      projectState.addProject(title, description, peopleAmout);
      this.clearInputs();
    }
  };

  private clearInputs() {
    this.titleInputEl.value = '';
    this.descriptionInputEl.value = '';
    this.peopleInput.value = '';
  }
}

export default ProjectInput;
