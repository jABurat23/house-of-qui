import { FastifyInstance } from "fastify"
import { HOUSE_IDENTITY } from "../../core/identity"

export function registerSystemRoutes(server: FastifyInstance) {

  server.get("/system", async () => {
    return HOUSE_IDENTITY
  })

  server.get("/health", async () => {
    return {
      status: "healthy",
      timestamp: new Date()
    }
  })

}