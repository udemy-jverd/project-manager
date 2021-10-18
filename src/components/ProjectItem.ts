import BaseComponent from './BaseComponent.js';
import { IDraggable } from '../interfaces/dragDrop.js';
import Project from '../models/Project.js';

class ProjectItem extends BaseComponent<HTMLUListElement, HTMLLIElement> implements IDraggable {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  dragStartHandler = (event: DragEvent): void => {
    const e = event;
    e.dataTransfer!.setData('text/plain', this.project.id);
    e.dataTransfer!.effectAllowed = 'move';
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  dragEndHandler = (event: DragEvent): void => {};

  public getPeopleLabel(): string {
    const { people } = this.project;
    return people > 1 ? `${people} persons assigned` : `${people} person assigned`;
  }

  public configure(): void {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  public renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.getPeopleLabel();
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

export default ProjectItem;
