import { useState, useEffect } from "react"
import { api } from "../api/client"

interface Props {
    projectId: string;
    projectName: string;
    onClose: () => void;
}

export default function DeploymentsModal({ projectId, projectName, onClose }: Props) {
    const [deployments, setDeployments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deploying, setDeploying] = useState(false)
    const [version, setVersion] = useState("1.0.1")

    const loadDeployments = async () => {
        try {
            const res = await api.get(`/monarch/projects/${projectId}/deployments`)
            setDeployments(res.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDeployments()
        const interval = setInterval(loadDeployments, 2000)
        return () => clearInterval(interval)
    }, [projectId])

    const handleDeploy = async () => {
        setDeploying(true)
        try {
            await api.post(`/monarch/projects/${projectId}/deploy`, { version })
            await loadDeployments()
        } finally {
            setDeploying(false)
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#222', padding: '20px', borderRadius: '8px',
                width: '600px', maxHeight: '80vh', overflowY: 'auto',
                color: '#eee', border: '1px solid #444'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ margin: 0 }}>🚀 {projectName} Deployments</h2>
                    <button onClick={onClose} style={{ padding: '4px 8px', cursor: 'pointer', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '4px' }}>Close</button>
                </div>

                <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={version}
                        onChange={e => setVersion(e.target.value)}
                        placeholder="Version (e.g. 1.0.1)"
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
                    />
                    <button
                        onClick={handleDeploy}
                        disabled={deploying}
                        style={{ padding: '6px 16px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {deploying ? "Deploying..." : "Deploy Now"}
                    </button>
                </div>

                {loading ? <p>Loading...</p> : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #444", textAlign: "left" }}>
                                <th style={{ padding: "8px" }}>ID</th>
                                <th style={{ padding: "8px" }}>Version</th>
                                <th style={{ padding: "8px" }}>Status</th>
                                <th style={{ padding: "8px" }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deployments.length === 0 ? (
                                <tr><td colSpan={4} style={{ padding: '8px', textAlign: 'center' }}>No deployments found</td></tr>
                            ) : deployments.map(d => (
                                <tr key={d.id} style={{ borderBottom: "1px solid #333" }}>
                                    <td style={{ padding: "8px", fontFamily: "monospace", color: "#888", cursor: "pointer" }} title={d.logs?.join('\n')}>
                                        {d.id.substring(0, 8)}
                                    </td>
                                    <td style={{ padding: "8px" }}>{d.version}</td>
                                    <td style={{ padding: "8px" }}>
                                        <span style={{
                                            padding: "2px 6px", borderRadius: "3px", fontSize: "12px", color: "#fff",
                                            backgroundColor: d.status === 'success' ? '#4caf50' :
                                                d.status === 'deploying' ? '#ff9800' :
                                                    d.status === 'failed' ? '#f44336' : '#555'
                                        }}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "8px" }}>{new Date(d.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
