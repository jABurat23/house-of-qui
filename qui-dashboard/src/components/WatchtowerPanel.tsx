import { useEffect, useState } from "react"
import { socket } from "../api/socket"

interface Alert {
  eventType: string
  metadata: any
  timestamp: string
}

export default function WatchtowerPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const handleAlert = (data: Alert) => {
      setAlerts(prev => [data, ...prev].slice(0, 5))
    }

    socket.on("system_alert", handleAlert)

    return () => {
      socket.off("system_alert")
    }
  }, [])

  if (alerts.length === 0) return null

  return (
    <div style={{ backgroundColor: "#1a0000", border: "1px solid #ff4444", borderRadius: "8px", padding: "16px", color: "#ff8888", marginBottom: "16px" }}>
      <h3 style={{ margin: "0 0 12px 0", color: "#ff4444", display: "flex", alignItems: "center", textTransform: "uppercase", fontSize: "14px" }}>
        📡 Imperial Watchtower: Active Alerts
        <span style={{ marginLeft: "10px", width: "10px", height: "10px", backgroundColor: "#ff0000", borderRadius: "50%", display: "inline-block", animation: "pulse-red 1.5s infinite" }}></span>
      </h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {alerts.map((alert, i) => (
          <div key={i} style={{ backgroundColor: "#2a0000", padding: "8px", borderRadius: "4px", border: "1px solid #440000", fontSize: "12px" }}>
            <div style={{ fontWeight: "bold", color: "#ffaaaa" }}>[{alert.eventType}]</div>
            <div style={{ margin: "4px 0" }}>{JSON.stringify(alert.metadata)}</div>
            <div style={{ fontSize: "10px", color: "#660000", textAlign: "right" }}>
              Signal Time: {new Date(alert.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes pulse-red {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
          }
        `}
      </style>
    </div>
  )
}
