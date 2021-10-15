interface Draggable {
  dragStartHandler(event: DragEvent): void,
  dragEndHandler(event: DragEvent): void
}

// interface DragTarget {
//   dragOverHandler(event: DragEvent): void,
//   dropHandler(event: DragEvent): void,
//   dragLeaveHandler(event: DragEvent): void
// }

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

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  public addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

// SINGLETON
class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    return new ProjectState();
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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  private templateElement: HTMLTemplateElement;
  private hostElement: T;
  protected element: U;

  constructor(templateId: string, hostElement: string, insertAtStart: boolean, newElementId?: string) {
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

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  dragStartHandler = (event: DragEvent): void => {
    console.log(event);
  };

  dragEndHandler = (event: DragEvent): void => {
    console.log(event);
  };

  public getPeopleLabel() {
    const { people } = this.project;
    return people > 1 ? `${people} persons assigned` : `${people} person assigned`;
  }

  public configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  public renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.getPeopleLabel();
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  private type;
  private assignedProjects: Project[];

  constructor(type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.type = type;
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  public renderContent() {
    this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
    this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  public configure() {
    projectState.addListener((projects: Project[]) => {
      const filteredProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = filteredProjects;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = '';
    this.assignedProjects.forEach((project) => {
      /* eslint-disable no-new */
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    });
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

  public configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  public renderContent() {
    console.log(this);
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

/* eslint-disable @typescript-eslint/no-unused-vars */
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
