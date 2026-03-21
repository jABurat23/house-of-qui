import { FastifyInstance } from "fastify"
import { registry } from "../../registry/projectRegistry"
import { authenticate } from "../../security/authMiddleware"

export function registerProjectRoutes(server: FastifyInstance) {

  server.get("/projects", { preHandler: authenticate }, async () => {
    return registry.listProjects()
  })

  server.get("/projects/:id", { preHandler: authenticate }, async (request: any) => {

    const project = registry.getProject(request.params.id)

    if (!project) {
      return { error: "Project not found" }
    }

    return project
  })

}