import { useEffect, useState } from "react"
import { api } from "../api/client"

interface AuditLog {
    id: string
    action: string
    actor: string
    targetId: string
    metadata: any
    level: string
    timestamp: string
}

export default function AuditLogsPanel() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLogs() {
            try {
                const res = await api.get("/system/audit")
                setLogs(res.data)
            } catch (err) {
                console.error("Failed to fetch audit logs", err)
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()

        // Refresh every 10s
        const interval = setInterval(fetchLogs, 10000)
        return () => clearInterval(interval)
    }, [])

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'critical': return '#f44336';
            case 'error': return '#ff5722';
            case 'warning': return '#ff9800';
            default: return '#9e9e9e';
        }
    }

    if (loading) return <p>Loading guard logs...</p>

    return (
        <div style={{ backgroundColor: "#1e1e1e", padding: "16px", borderRadius: "8px", border: "1px solid #333", maxHeight: "400px", overflowY: "auto" }}>
            <h3 style={{ marginTop: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                🛡️ Imperial Guard (Audit Logs)
                <span style={{ fontSize: "12px", color: "#666" }}>Last 100 events</span>
            </h3>

            <div style={{ display: "grid", gap: "8px" }}>
                {logs.length === 0 ? (
                    <p style={{ color: "#666", fontSize: "13px" }}>No events recorded in the scrolls.</p>
                ) : (
                    logs.map(log => (
                        <div key={log.id} style={{
                            padding: "8px",
                            backgroundColor: "#252525",
                            borderRadius: "4px",
                            fontSize: "12px",
                            borderLeft: `3px solid ${getLevelColor(log.level)}`
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#888", marginBottom: "4px" }}>
                                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span style={{ color: getLevelColor(log.level), fontWeight: "bold", fontSize: "10px" }}>{log.level.toUpperCase()}</span>
                            </div>
                            <div style={{ color: "#eee" }}>
                                <strong style={{ color: "#bb86fc" }}>{log.action}</strong>
                                {log.actor && <span style={{ color: "#03dac6" }}> by {log.actor.substring(0, 8)}</span>}
                            </div>
                            <div style={{ color: "#666", marginTop: "2px", fontSize: "11px" }}>
                                Target: {log.targetId?.substring(0, 8)}...
                            </div>
                            {log.metadata && (
                                <pre style={{ margin: "4px 0 0 0", fontSize: "10px", color: "#4caf50", overflowX: "hidden" }}>
                                    {JSON.stringify(log.metadata)}
                                </pre>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
