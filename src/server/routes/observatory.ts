import { FastifyInstance } from "fastify"
import { observatory } from "../../observatory/telemetryStore"
import { authenticate } from "../../security/authMiddleware"

export function registerObservatoryRoutes(server: FastifyInstance) {

  server.post("/observatory/heartbeat", { preHandler: authenticate }, async (request: any) => {

    const data = request.body

    observatory.update({
      projectId: data.projectId,
      status: "online",
      version: data.version,
      uptime: data.uptime,
      lastPing: new Date()
    })

    return { success: true }

  })

  server.get("/observatory", async () => {
    return observatory.list()
  })

}