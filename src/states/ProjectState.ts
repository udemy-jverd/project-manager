import State from './State.js';
import Project from '../models/Project.js';
import ProjectStatus from '../utils/project-status.js';

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
    this.updateListeners();
  }

  public moveProject(projectId: string, newStatus: ProjectStatus) {
    const currentProject = this.projects.find((project) => project.id === projectId);
    if (currentProject && currentProject.status !== newStatus) {
      currentProject.status = newStatus;
      this.updateListeners();
    }
  }

  public updateListeners() {
    this.listeners.forEach((listenerFn) => {
      listenerFn(this.projects.slice());
    });
  }
}

const projectState = ProjectState.getInstance();

export default projectState;
