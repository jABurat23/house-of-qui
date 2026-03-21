import { useEffect, useState } from "react"
import { socket } from "../api/socket"

interface ResourceUsage {
  projectId: string
  name: string
  usage: {
    memory: number
    cpu: number
    storage: number
  }
  limits: {
    memory: number
    cpu: number
    storage: number
  }
  timestamp: string
}

export default function ResourceUsagePanel() {
  const [usages, setUsages] = useState<Record<string, ResourceUsage>>({})

  useEffect(() => {
    const handleUsage = (data: ResourceUsage) => {
      setUsages(prev => ({
        ...prev,
        [data.projectId]: data
      }))
    }

    socket.on("resource_usage", handleUsage)

    return () => {
      socket.off("resource_usage")
    }
  }, [])

  const usageList = Object.values(usages)

  if (usageList.length === 0) return null

  return (
    <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "8px", padding: "16px", color: "#eee" }}>
      <h3 style={{ margin: "0 0 16px 0", color: "#81c784", display: "flex", alignItems: "center" }}>
        🚛 Imperial Logistics: Resource Tracking
        <span style={{ marginLeft: "10px", width: "8px", height: "8px", backgroundColor: "#4caf50", borderRadius: "50%", display: "inline-block" }}></span>
      </h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {usageList.map(item => (
          <div key={item.projectId} style={{ backgroundColor: "#252525", padding: "12px", borderRadius: "6px", border: "1px solid #444" }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px", borderBottom: "1px solid #333", paddingBottom: "4px" }}>
              {item.name}
            </div>
            
            <ResourceBar label="Memory" used={item.usage.memory} limit={item.limits.memory} unit="MB" color="#42a5f5" />
            <ResourceBar label="CPU" used={item.usage.cpu} limit={item.limits.cpu} unit="m" color="#ffa726" />
            <ResourceBar label="Storage" used={item.usage.storage} limit={item.limits.storage} unit="MB" color="#ef5350" />
            
            <div style={{ fontSize: "10px", color: "#666", textAlign: "right", marginTop: "4px" }}>
              Signal: {new Date(item.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResourceBar({ label, used, limit, unit, color }: { label: string, used: number, limit: number, unit: string, color: string }) {
  const percent = Math.min(100, Math.floor((used / limit) * 100))
  
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "2px" }}>
        <span>{label}</span>
        <span>{used}{unit} / {limit}{unit} ({percent}%)</span>
      </div>
      <div style={{ height: "6px", backgroundColor: "#111", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ 
          height: "100%", 
          width: `${percent}%`, 
          backgroundColor: color,
          transition: "width 0.5s ease" 
        }} />
      </div>
    </div>
  )
}
