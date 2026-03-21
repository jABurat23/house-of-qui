import { Project } from "./projectTypes"

class ProjectRegistry {

  private projects: Map<string, Project> = new Map()

  register(project: Project) {
    this.projects.set(project.id, project)
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id)
  }

  listProjects(): Project[] {
    return Array.from(this.projects.values())
  }

}

export const registry = new ProjectRegistry()