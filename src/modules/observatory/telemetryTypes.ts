export interface TelemetryRecord {
  projectId: string
  status: "online" | "offline"
  version: string
  uptime: number
  lastPing: Date
}