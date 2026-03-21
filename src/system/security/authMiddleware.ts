import { FastifyRequest, FastifyReply } from "fastify"
import { verifyServiceToken } from "./tokenService"

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const auth = request.headers.authorization

  if (!auth) {
    reply.status(401).send({ error: "Missing authorization header" })
    return
  }

  const token = auth.replace("Bearer ", "")

  const decoded = verifyServiceToken(token)

  if (!decoded) {
    reply.status(403).send({ error: "Invalid token" })
    return
  }

}