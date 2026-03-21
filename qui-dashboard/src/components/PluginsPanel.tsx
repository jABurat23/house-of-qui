import { useEffect, useState } from "react"
import { api } from "../api/client"

interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author?: string
  enabled: boolean
}

export default function PluginsPanel() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlugins()
  }, [])

  const fetchPlugins = async () => {
    try {
      setLoading(true)
      const res = await api.get("/plugins")
      setPlugins(res.data)
      setError(null)
    } catch (err: any) {
      setError("Failed to load plugins")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePlugin = async (pluginId: string, currentlyEnabled: boolean) => {
    try {
      const endpoint = currentlyEnabled ? "disable" : "enable"
      await api.post(`/plugins/${pluginId}/${endpoint}`)
      setPlugins((prev) =>
        prev.map((p) =>
          p.id === pluginId ? { ...p, enabled: !p.enabled } : p
        )
      )
    } catch (err: any) {
      setError(`Failed to toggle plugin: ${err.message}`)
    }
  }

  if (loading) {
    return <div style={{ padding: "8px", color: "#666" }}>Loading plugins...</div>
  }

  return (
    <div style={{ padding: "12px" }}>
      <h3>🔌 Plugin System</h3>

      {error && (
        <div style={{ color: "red", marginBottom: "8px", fontSize: "12px" }}>
          ⚠️ {error}
        </div>
      )}

      {plugins.length === 0 ? (
        <p style={{ color: "#999", fontSize: "12px" }}>No plugins available</p>
      ) : (
        <div style={{ display: "grid", gap: "8px" }}>
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "8px",
                backgroundColor: plugin.enabled ? "#f0f8ff" : "#f5f5f5"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
                    {plugin.enabled ? "✅" : "⏸️"} {plugin.name}
                  </h4>
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#666" }}>
                    {plugin.description}
                  </p>
                  <div style={{ fontSize: "11px", color: "#999" }}>
                    v{plugin.version}
                    {plugin.author && ` • by ${plugin.author}`}
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePlugin(plugin.id, plugin.enabled)}
                  style={{
                    padding: "4px 12px",
                    fontSize: "12px",
                    borderRadius: "3px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: plugin.enabled ? "#ff6b6b" : "#4caf50",
                    color: "white",
                    fontWeight: "bold",
                    whiteSpace: "nowrap"
                  }}
                >
                  {plugin.enabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchPlugins}
        style={{
          marginTop: "12px",
          padding: "6px 12px",
          fontSize: "12px",
          borderRadius: "3px",
          border: "1px solid #999",
          backgroundColor: "#f9f9f9",
          cursor: "pointer"
        }}
      >
        🔄 Refresh
      </button>
    </div>
  )
}
