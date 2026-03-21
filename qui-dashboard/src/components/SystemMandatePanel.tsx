import { useEffect, useState } from "react"
import { api } from "../api/client"

interface ConfigEntry {
    key: string
    value: string
    type: string
    category: string
    description: string
}

export default function SystemMandatePanel() {
    const [configs, setConfigs] = useState<ConfigEntry[]>([])
    const [loading, setLoading] = useState(true)

    const fetchConfigs = async () => {
        try {
            const res = await api.get("/system/config")
            setConfigs(res.data)
        } catch (err) {
            console.error("Failed to fetch mandates", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConfigs()
    }, [])

    const toggleBoolean = async (key: string, currentValue: string) => {
        const newValue = currentValue === 'true' ? false : true;
        try {
            await api.post("/system/config", { key, value: newValue });
            fetchConfigs();
        } catch (err) {
            alert("Failed to update mandate");
        }
    }

    const updateNumber = async (key: string) => {
        const val = prompt("Enter new value:");
        if (val === null) return;
        try {
            await api.post("/system/config", { key, value: Number(val) });
            fetchConfigs();
        } catch (err) {
            alert("Invalid input");
        }
    }

    const updateString = async (key: string) => {
        const val = prompt("Enter new value:");
        if (val === null) return;
        try {
            await api.post("/system/config", { key, value: val });
            fetchConfigs();
        } catch (err) {
            alert("Failed to update mandate");
        }
    }

    if (loading) return <p>Fetching Imperial Mandates...</p>

    return (
        <div style={{ backgroundColor: "#1e1e1e", padding: "16px", borderRadius: "8px", border: "1px solid #333" }}>
            <h3 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                📜 Imperial Mandate (System Control)
            </h3>

            <div style={{ display: "grid", gap: "10px" }}>
                {configs.map(cfg => (
                    <div key={cfg.key} style={{
                        padding: "10px",
                        backgroundColor: "#252525",
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <strong style={{ color: "#ffb74d", fontSize: "13px" }}>{cfg.key.toUpperCase().replace(/_/g, ' ')}</strong>
                                <span style={{ fontSize: "10px", color: "#666", textTransform: "uppercase" }}>[{cfg.category}]</span>
                            </div>
                            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#888" }}>{cfg.description}</p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{
                                fontSize: "13px",
                                fontWeight: "bold",
                                color: cfg.type === 'boolean' ? (cfg.value === 'true' ? '#4caf50' : '#f44336') : '#eee'
                            }}>
                                {cfg.value}
                            </span>

                            {cfg.type === 'boolean' && (
                                <button
                                    onClick={() => toggleBoolean(cfg.key, cfg.value)}
                                    style={{ padding: "4px 8px", backgroundColor: "#333", border: "1px solid #444", color: "#eee", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}
                                >
                                    Toggle
                                </button>
                            )}

                            {cfg.type === 'number' && (
                                <button
                                    onClick={() => updateNumber(cfg.key)}
                                    style={{ padding: "4px 8px", backgroundColor: "#333", border: "1px solid #444", color: "#eee", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}
                                >
                                    Set
                                </button>
                            )}

                            {cfg.type === 'string' && (
                                <button
                                    onClick={() => updateString(cfg.key)}
                                    style={{ padding: "4px 8px", backgroundColor: "#333", border: "1px solid #444", color: "#eee", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
