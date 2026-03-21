import { useEffect, useState } from "react"
import { api } from "../api/client"

export default function SystemMetrics() {
    const [metrics, setMetrics] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadMetrics() {
            try {
                const res = await api.get("/monarch/projects/system")
                if (res.data && !res.data.status) {
                    setMetrics(res.data)
                    setError(null)
                } else {
                    setError(res.data?.status || "Metrics unavailable")
                }
            } catch {
                setError("API unreachable")
            }
        }

        loadMetrics()
        const interval = setInterval(loadMetrics, 5000)
        return () => clearInterval(interval)
    }, [])

    if (error) return null // quiet failure — don't break layout

    if (!metrics) return (
        <div style={{ padding: "12px", backgroundColor: "#2d2d2d", borderRadius: "8px", color: "#888" }}>
            Loading system metrics...
        </div>
    )

    const mem = metrics.memory
    const uptimeMin = Math.floor(metrics.uptime / 60)
    const uptimeSec = Math.floor(metrics.uptime % 60)

    const barStyle = (pct: number, color: string) => ({
        width: `${Math.min(pct, 100)}%`,
        height: "6px",
        backgroundColor: color,
        borderRadius: "3px",
        transition: "width 0.5s ease"
    })

    return (
        <div style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "20px",
            color: "#e0e0e0"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>
                    📡 Imperial Observatory V2
                    <span style={{ fontSize: "11px", color: "#4caf50", marginLeft: "10px", fontWeight: "normal" }}>
                        ● LIVE
                    </span>
                </h3>
                <span style={{ fontSize: "12px", color: "#666" }}>
                    Updated: {new Date(metrics.timestamp).toLocaleTimeString()}
                </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>

                {/* System RAM */}
                <div style={{ backgroundColor: "#242424", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>System RAM</div>
                    <div style={{ fontSize: "22px", fontWeight: "bold", color: "#81c784" }}>{mem.systemUsedPct}%</div>
                    <div style={{ fontSize: "11px", color: "#666", margin: "4px 0 8px 0" }}>
                        {Math.round(mem.systemUsed)} MB / {Math.round(mem.systemTotal)} MB
                    </div>
                    <div style={{ backgroundColor: "#333", borderRadius: "3px", height: "6px" }}>
                        <div style={barStyle(mem.systemUsedPct, "#81c784")} />
                    </div>
                </div>

                {/* Heap Usage */}
                <div style={{ backgroundColor: "#242424", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Node Heap</div>
                    <div style={{ fontSize: "22px", fontWeight: "bold", color: "#64b5f6" }}>
                        {Math.round((mem.heapUsed / mem.heapTotal) * 100)}%
                    </div>
                    <div style={{ fontSize: "11px", color: "#666", margin: "4px 0 8px 0" }}>
                        {Math.round(mem.heapUsed)} MB / {Math.round(mem.heapTotal)} MB
                    </div>
                    <div style={{ backgroundColor: "#333", borderRadius: "3px", height: "6px" }}>
                        <div style={barStyle((mem.heapUsed / mem.heapTotal) * 100, "#64b5f6")} />
                    </div>
                </div>

                {/* CPU Load */}
                <div style={{ backgroundColor: "#242424", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>CPU Load Avg</div>
                    <div style={{ fontSize: "22px", fontWeight: "bold", color: "#ffb74d" }}>
                        {metrics.cpu.load1m.toFixed(2)}
                    </div>
                    <div style={{ fontSize: "11px", color: "#666", margin: "4px 0 8px 0" }}>
                        5m: {metrics.cpu.load5m.toFixed(2)} · 15m: {metrics.cpu.load15m.toFixed(2)}
                    </div>
                    <div style={{ backgroundColor: "#333", borderRadius: "3px", height: "6px" }}>
                        <div style={barStyle(Math.min(metrics.cpu.load1m * 25, 100), "#ffb74d")} />
                    </div>
                </div>

                {/* Uptime */}
                <div style={{ backgroundColor: "#242424", borderRadius: "8px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Uptime</div>
                    <div style={{ fontSize: "22px", fontWeight: "bold", color: "#ba68c8" }}>
                        {uptimeMin}m {uptimeSec}s
                    </div>
                    <div style={{ fontSize: "11px", color: "#666", margin: "4px 0 8px 0" }}>
                        RSS: {Math.round(mem.rss)} MB
                    </div>
                    <div style={{ display: "inline-block", backgroundColor: "#4caf5022", borderRadius: "12px", padding: "2px 8px", marginTop: "4px" }}>
                        <span style={{ fontSize: "11px", color: "#4caf50" }}>● Healthy</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
