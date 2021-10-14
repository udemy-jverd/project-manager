interface IValidatable {
  value: string | number,
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  minValue?: number,
  maxValue?: number,
}

const isValid = (input: IValidatable) => {
  let isOk = true;
  if (input.required) {
    isOk = isOk && input.value.toString().trim().length !== 0;
  }
  if (input.minLength != null && typeof input.value === 'string') {
    isOk = isOk && input.value.length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === 'string') {
    isOk = isOk && input.value.length <= input.maxLength;
  }
  if (input.minValue != null && typeof input.value === 'number') {
    isOk = isOk && input.value >= input.minValue;
  }
  if (input.maxValue != null && typeof input.value === 'number') {
    isOk = isOk && input.value <= input.maxValue;
  }
  return isOk;
};

enum ProjectStatus {Active, Finished }

class Project {
  public id: string;
  public title: string;
  public description: string;
  public people: number;
  public status: ProjectStatus;

  constructor(
    id: string,
    title: string,
    description: string,
    people: number,
    status: ProjectStatus,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.people = people;
    this.status = status;
  }
}

type Listener = (items: Project[]) => void;

// SINGLETON
class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    return new ProjectState();
  }

  public addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  public addProject(title: string, description: string, peopleAmount: number) {
    this.projects.push(
      new Project(
        Math.random().toString(),
        title,
        description,
        peopleAmount,
        ProjectStatus.Active,
      ),
    );

    this.listeners.forEach((listenerFn) => {
      listenerFn(this.projects.slice());
    });
  }
}

const projectState = ProjectState.getInstance();

class ProjectList {
  private type;
  private projectInputEl: HTMLTemplateElement;
  private appEl: HTMLDivElement;
  private sectionEl: HTMLElement;
  private assignedProjects: Project[];

  constructor(type: 'active' | 'finished') {
    this.type = type;
    this.projectInputEl = document.getElementById('project-list')! as HTMLTemplateElement;
    this.appEl = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];
    const node = document.importNode(this.projectInputEl.content, true);
    this.sectionEl = node.firstElementChild as HTMLElement;
    this.sectionEl.id = `${type}-projects`;

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private attach() {
    this.appEl.insertAdjacentElement('afterbegin', this.sectionEl);
  }

  private renderContent() {
    this.sectionEl.querySelector('ul')!.id = `${this.type}-projects-list`;
    this.sectionEl.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    this.assignedProjects.forEach((project) => {
      const listItem = document.createElement('li');
      listItem.textContent = project.title;
      listEl.appendChild(listItem);
    });
  }
}

class ProjectInput {
  private projectInputEl: HTMLTemplateElement;
  private appEl: HTMLDivElement;
  private formEl: HTMLFormElement;
  private titleInputEl: HTMLInputElement;
  private descriptionInputEl: HTMLInputElement;
  private peopleInput: HTMLInputElement;

  constructor() {
    this.projectInputEl = document.getElementById('project-input')! as HTMLTemplateElement;
    this.appEl = document.getElementById('app')! as HTMLDivElement;
    const node = document.importNode(this.projectInputEl.content, true);
    this.formEl = node.firstElementChild as HTMLFormElement;

    this.titleInputEl = this.formEl.querySelector('#title') as HTMLInputElement;
    this.descriptionInputEl = this.formEl.querySelector('#description') as HTMLInputElement;
    this.peopleInput = this.formEl.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private configure() {
    this.formEl.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.appEl.insertAdjacentElement('afterbegin', this.formEl);
  }

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

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
