import { io } from "../server/server"

export function recordTelemetry(data: any) {

  console.log("Telemetry received:", data)

  io.emit("telemetry_update", data)

}