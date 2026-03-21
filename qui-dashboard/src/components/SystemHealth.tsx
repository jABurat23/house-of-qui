import { useEffect, useState } from "react"
import { api } from "../api/client"

export default function SystemHealth() {
  const [health, setHealth] = useState<any>(null)

  useEffect(() => {
    async function loadHealth() {
      try {
        const res = await api.get("/health")
        setHealth(res.data)
      } catch (e) {
        setHealth({ status: 'OFFLINE', timestamp: new Date() })
      }
    }
    loadHealth()
    const int = setInterval(loadHealth, 30000)
    return () => clearInterval(int)
  }, [])

  if (!health) return <div style={{ color: "rgba(0,195,255,0.5)", fontSize: "12px", letterSpacing: "1px" }}>INITIALIZING IMPERIAL PULSE...</div>

  const isOnline = health.status === 'ok' || health.status === 'UP'

  return (
    <div style={{ background: "rgba(0, 195, 255, 0.05)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(0, 195, 255, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>Imperial Sovereign Pulse</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: isOnline ? "#00ff88" : "#ff3366" }}>{isOnline ? "OPERATIONAL" : "DEGRADED"}</span>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: isOnline ? "#00ff88" : "#ff3366", boxShadow: `0 0 10px ${isOnline ? "#00ff88" : "#ff3366"}` }} />
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>HEARTBEAT_SEC_OK: {new Date(health.timestamp).toLocaleTimeString()}</p>
        <p style={{ margin: 0, fontSize: "10px", color: "#00c3ff", opacity: 0.8 }}>SYSCALL_MANDATE: VERIFIED</p>
      </div>
    </div>
  )
}