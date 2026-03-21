import { useEffect, useState } from "react"
import { api } from "../api/client"

interface Artifact {
    id: string
    version: string
    filename: string
    size: number
    createdAt: string
    status: string
}

interface Props {
    projectId: string
}

export default function ArchivePanel({ projectId }: Props) {
    const [artifacts, setArtifacts] = useState<Artifact[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchArtifacts() {
            try {
                const res = await api.get(`/monarch/archive/project/${projectId}`)
                setArtifacts(res.data)
            } catch (err) {
                console.error("Failed to fetch artifacts", err)
            } finally {
                setLoading(false)
            }
        }
        if (projectId) fetchArtifacts()
    }, [projectId])

    const handleRollback = async (artifactId: string, version: string) => {
        if (!window.confirm(`Initiate Imperial Recovery: Rollback to version v${version}?`)) return;

        try {
            await api.post(`/monarch/projects/${projectId}/rollback`, { artifactId });
            alert(`Rollback to v${version} initiated successfully.`);
        } catch (err) {
            console.error("Rollback failed", err);
            alert("Imperial Recovery failed to initiate.");
        }
    }

    if (loading) return <p>Retrieving archives...</p>

    return (
        <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#252525", borderRadius: "6px" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#64b5f6" }}>📦 Imperial Archive Versions</h4>

            {artifacts.length === 0 ? (
                <p style={{ fontSize: "12px", color: "#666" }}>No build artifacts found in the archive for this project.</p>
            ) : (
                <div style={{ display: "grid", gap: "8px" }}>
                    {artifacts.map(art => (
                        <div key={art.id} style={{
                            padding: "8px",
                            backgroundColor: "#1e1e1e",
                            borderRadius: "4px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "13px"
                        }}>
                            <div>
                                <strong style={{ color: "#4caf50" }}>v{art.version}</strong>
                                <span style={{ marginLeft: "8px", color: "#aaa" }}>{art.filename}</span>
                                <div style={{ fontSize: "11px", color: "#666" }}>
                                    {(art.size / 1024).toFixed(2)} KB • {new Date(art.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <button
                                onClick={() => handleRollback(art.id, art.version)}
                                style={{
                                    padding: "4px 8px",
                                    backgroundColor: "#333",
                                    border: "1px solid #444",
                                    color: "#eee",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "11px"
                                }}
                            >
                                Rollback
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
