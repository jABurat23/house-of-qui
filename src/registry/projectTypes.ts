export type ProjectStatus =
  | "active"
  | "maintenance"
  | "archived"
  | "experimental"

export interface Project {
  id: string
  name: string
  description?: string
  repository?: string
  version: string
  status: ProjectStatus
  createdAt: Date
}