import { useEffect, useState } from "react"
import { socket } from "../api/socket"

interface SignedEvent {
  eventType: string
  metadata: any
  signature: string
  sealed: boolean
  timestamp: string
}

export default function ImperialSealPanel() {
  const [events, setEvents] = useState<SignedEvent[]>([])
  const [integrityStatus, setIntegrityStatus] = useState<'SOVEREIGN' | 'COMPROMISED'>('SOVEREIGN')

  useEffect(() => {
    const handleAlert = (data: SignedEvent) => {
      setEvents(prev => [data, ...prev].slice(0, 5))
      if (!data.sealed) {
          setIntegrityStatus('COMPROMISED')
      }
    }

    socket.on("system_alert", handleAlert)
    return () => {
      socket.off("system_alert")
    }
  }, [])

  return (
    <div style={{ backgroundColor: "#050a0f", borderRadius: "12px", border: "1px solid #00c3ff", padding: "20px", color: "#00c3ff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: integrityStatus === 'SOVEREIGN' ? "rgba(0, 195, 255, 0.1)" : "rgba(255, 0, 0, 0.1)", filter: "blur(40px)" }} />

      <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
        🔒 Imperial Seal: {integrityStatus}
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: integrityStatus === 'SOVEREIGN' ? "#00ff00" : "#ff0000", boxShadow: integrityStatus === 'SOVEREIGN' ? "0 0 8px #00ff00" : "0 0 8px #ff0000" }} />
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {events.length === 0 && <div style={{ fontSize: "12px", opacity: 0.6 }}>Awaiting cryptographically signed mandates...</div>}
        {events.map((ev, i) => (
          <div key={i} style={{ backgroundColor: "rgba(0, 195, 255, 0.05)", border: "1px solid rgba(0, 195, 255, 0.2)", borderRadius: "8px", padding: "10px", fontSize: "11px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontWeight: "bold" }}>⚡ {ev.eventType}</span>
              <span style={{ fontSize: "9px", opacity: 0.5 }}>{new Date(ev.timestamp).toLocaleTimeString()}</span>
            </div>
            <div style={{ wordBreak: "break-all", fontStyle: "italic", opacity: 0.7 }}>
              Seal: {ev.signature.substring(0, 64)}...
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid rgba(0, 195, 255, 0.2)", fontSize: "10px", opacity: 0.6 }}>
        All mandates signed with RSA-2048 Imperial Root Seal. Verification enforced globally.
      </div>
    </div>
  )
}
