import { useEffect, useState } from "react"
import { socket } from "../api/socket"

type EventType = "registration" | "telemetry" | "deployment"

interface Event {
  type: EventType
  projectId?: string
  name?: string
  version?: string
  status?: string
  timestamp?: string
}

export default function ObservatoryPanel() {
  const [records, setRecords] = useState<Event[]>([])

  useEffect(() => {
    socket.on("telemetry_update", (data: any) => {
      setRecords((prev) => [{ type: "telemetry", ...data }, ...prev].slice(0, 50))
    })

    socket.on("project_registered", (data: any) => {
      setRecords((prev) => [{ type: "registration", ...data }, ...prev].slice(0, 50))
    })

    socket.on("deployment_started", (data: any) => {
      setRecords((prev) => [{ type: "deployment", ...data }, ...prev].slice(0, 50))
    })

    return () => {
      socket.off("telemetry_update")
      socket.off("project_registered")
      socket.off("deployment_started")
    }
  }, [])

  const iconFor = (type: EventType) => {
    if (type === "registration") return "📍"
    if (type === "deployment") return "🚀"
    return "📊"
  }

  const colorFor = (type: EventType) => {
    if (type === "registration") return "#64b5f6"
    if (type === "deployment") return "#ffb74d"
    return "#81c784"
  }

  const labelFor = (type: EventType) => {
    if (type === "registration") return "REGISTER"
    if (type === "deployment") return "DEPLOY"
    return "TELEMETRY"
  }

  return (
    <div style={{ height: "100%" }}>
      <h3 style={{ marginTop: 0 }}>🔭 Live Events</h3>

      {records.length === 0 ? (
        <p style={{ color: "#888", fontSize: "14px" }}>Awaiting system events...</p>
      ) : (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {records.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "8px",
              padding: "6px 0",
              borderBottom: "1px solid #2a2a2a",
              fontSize: "12px"
            }}>
              <span style={{ fontSize: "14px" }}>{iconFor(r.type)}</span>
              <div>
                <span style={{
                  backgroundColor: colorFor(r.type) + "22",
                  color: colorFor(r.type),
                  padding: "1px 5px",
                  borderRadius: "3px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  marginRight: "6px"
                }}>
                  {labelFor(r.type)}
                </span>
                <span style={{ color: "#bbb" }}>
                  {r.name || r.projectId?.substring(0, 8)}
                  {r.version ? ` · v${r.version}` : ""}
                  {r.status ? ` · ${r.status}` : ""}
                </span>
                <span style={{ color: "#555", marginLeft: "8px" }}>
                  {r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}