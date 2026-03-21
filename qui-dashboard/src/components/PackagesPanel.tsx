import { useEffect, useState } from "react"
import { api } from "../api/client"

interface Package {
    id: string
    namespace: string
    name: string
    version: string
    description: string
    downloads: number
    stability: string
    signature?: string
}

export default function PackagesPanel() {
    const [packages, setPackages] = useState<Package[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPackages() {
            try {
                const res = await api.get("/packages")
                setPackages(res.data)
            } catch (err) {
                console.error("Failed to fetch packages", err)
            } finally {
                setLoading(false)
            }
        }
        fetchPackages()
    }, [])

    if (loading) return <p>Loading registry...</p>

    return (
        <div style={{ backgroundColor: "#1e1e1e", padding: "16px", borderRadius: "8px", border: "1px solid #333" }}>
            <h3 style={{ marginTop: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                📦 House Package Registry
                <span style={{ fontSize: "12px", color: "#666" }}>{packages.length} available</span>
            </h3>

            <div style={{ display: "grid", gap: "10px" }}>
                {packages.map(pkg => (
                    <div key={pkg.id} style={{
                        padding: "10px",
                        backgroundColor: "#2a2a2a",
                        borderRadius: "6px",
                        borderLeft: `4px solid ${pkg.stability === 'stable' ? '#4caf50' : pkg.stability === 'beta' ? '#ff9800' : '#f44336'}`
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <strong style={{ color: "#64b5f6" }}>
                                @{pkg.namespace}/{pkg.name}
                                {pkg.signature && (
                                    <span title="Seal verified by Monarch" style={{ marginLeft: "6px", cursor: "help", fontSize: "14px" }}>
                                        🔒
                                    </span>
                                )}
                            </strong>
                            <span style={{ fontSize: "12px", color: "#888" }}>v{pkg.version}</span>
                        </div>
                        <p style={{ margin: "4px 0", fontSize: "13px", color: "#ccc" }}>{pkg.description}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                            <span style={{ fontSize: "11px", color: "#666" }}>📥 {pkg.downloads} downloads</span>
                            <code style={{ fontSize: "11px", backgroundColor: "#000", padding: "2px 4px", borderRadius: "3px" }}>
                                qui install {pkg.namespace}/{pkg.name}
                            </code>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
