import ProjectStatus from '../utils/project-status.js';

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

export default Project;
