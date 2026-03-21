import { useEffect, useState } from "react"
import { api } from "../api/client"

interface Props {
    projectId: string;
}

export default function ProjectMetrics({ projectId }: Props) {
    const [metrics, setMetrics] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadMetrics() {
            try {
                const res = await api.get(`/monarch/projects/${projectId}/metrics`)
                if (res.data && !res.data.status) {
                    setMetrics(res.data)
                    setError(null)
                } else {
                    setError(res.data.status || "Metrics unavailable")
                }
            } catch (err: any) {
                setError(err.message)
            }
        }

        loadMetrics()
        const interval = setInterval(loadMetrics, 5000)
        return () => clearInterval(interval)
    }, [projectId])

    if (error) return <div style={{ fontSize: "12px", color: "#f44336" }}>{error}</div>
    if (!metrics) return <div style={{ fontSize: "12px", color: "#888" }}>Loading metrics...</div>

    return (
        <div style={{ fontSize: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", backgroundColor: "#f9f9f9", padding: "8px", borderRadius: "4px", marginTop: "8px" }}>
            <div><span style={{ color: "#666" }}>Requests:</span> <strong>{metrics.requests || 0}</strong></div>
            <div><span style={{ color: "#666" }}>Errors:</span> <strong style={{ color: metrics.errors > 0 ? "#f44336" : "inherit" }}>{metrics.errors || 0}</strong></div>
            <div><span style={{ color: "#666" }}>Latency:</span> <strong>{metrics.latency || 0}ms</strong></div>
            <div><span style={{ color: "#666" }}>Uptime:</span> <strong>{metrics.uptime || 0}m</strong></div>
        </div>
    )
}
