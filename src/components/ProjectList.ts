import BaseComponent from './BaseComponent.js';
import { IDragTarget } from '../interfaces/drag-n-drop.js';
import Project from '../models/Project.js';
import ProjectStatus from '../utils/project-status.js';
import ProjectItem from './ProjectItem.js';
import projectState from '../states/ProjectState.js';

class ProjectList extends BaseComponent<HTMLDivElement, HTMLElement> implements IDragTarget {
  private type;
  private assignedProjects: Project[];

  constructor(type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.type = type;
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  dragOverHandler = (event: DragEvent): void => {
    if (event.dataTransfer) {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  };

  dropHandler = (event: DragEvent): void => {
    event.preventDefault();
    const projectId = event.dataTransfer!.getData('text/plain');
    const status = this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished;
    projectState.moveProject(projectId, status);
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  dragLeaveHandler = (event: DragEvent): void => {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  };

  public renderContent() {
    this.element.querySelector('ul')!.id = `${this.type}-projects-list`;
    this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  public configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

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

export default ProjectList;
