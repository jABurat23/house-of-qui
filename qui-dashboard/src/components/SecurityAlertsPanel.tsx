import { useEffect, useState } from "react"
import { socket } from "../api/socket"

interface SecurityAlert {
    type: string
    severity: string
    message: string
    projectName: string
    action: string
    timestamp: string
}

export default function SecurityAlertsPanel() {
    const [alerts, setAlerts] = useState<SecurityAlert[]>([])

    useEffect(() => {
        const handleAlert = (alert: SecurityAlert) => {
            setAlerts(prev => [alert, ...prev].slice(0, 10))
        }

        socket.on("security_alert", handleAlert)

        return () => {
            socket.off("security_alert")
        }
    }, [])

    if (alerts.length === 0) return null;

    return (
        <div style={{
            backgroundColor: "#2c0e0e",
            border: "2px solid #f44336",
            borderRadius: "8px",
            padding: "16px",
            color: "#ffcdd2",
            marginBottom: "20px",
            animation: "pulse 2s infinite"
        }}>
            <style>
                {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
            100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
          }
        `}
            </style>
            <h3 style={{ margin: "0 0 12px 0", display: "flex", alignItems: "center", textTransform: "uppercase", letterSpacing: "1px" }}>
                🚨 Imperial Security Alert: Intrusion Detected
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {alerts.map((alert, i) => (
                    <div key={i} style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "4px", borderLeft: "4px solid #f44336" }}>
                        <div style={{ fontWeight: "bold", color: "#ef9a9a" }}>{alert.message}</div>
                        <div style={{ fontSize: "12px", marginTop: "4px", display: "flex", gap: "15px" }}>
                            <span><strong>Project:</strong> {alert.projectName}</span>
                            <span><strong>Action:</strong> {alert.action}</span>
                            <span><strong>Time:</strong> {new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
