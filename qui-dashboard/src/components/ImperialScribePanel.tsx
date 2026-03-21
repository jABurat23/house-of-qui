import { useEffect, useState } from "react"
import { api } from "../api/client"

interface Chronicle {
  id: string
  content: string
  diagram: string
  metadata: any
  project?: {
    name: string
    id: string
  }
}

export default function ImperialScribePanel() {
  const [chronicles, setChronicles] = useState<Chronicle[]>([])
  const [selected, setSelected] = useState<Chronicle | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchChronicles()
  }, [])

  async function fetchChronicles() {
    try {
      const res = await api.get("/monarch/scribe/chronicles")
      setChronicles(res.data)
    } catch (e) {
      console.error("Scribe failure", e)
    }
  }

  async function triggerChronicle(projectId: string) {
    setLoading(true)
    try {
      await api.post(`/monarch/scribe/chronicle/${projectId}`, {}, {
        headers: { 'x-imperial-role': 'OVERSEER' }
      })
      await fetchChronicles()
    } catch (e) {
       alert("Scribe mandate rejected.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: "#0d1117", borderRadius: "12px", border: "1px solid #30363d", padding: "20px", color: "#c9d1d9", height: "600px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "#58a6ff", display: "flex", alignItems: "center", gap: "10px" }}>
            🖋️ Imperial Scribe: Document Registry
        </h3>
        <button 
          onClick={() => triggerChronicle('HOUSE_OF_QUI_CORE')} 
          disabled={loading}
          style={{ backgroundColor: "#238636", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
        >
          {loading ? 'Chronicling...' : 'Chronicle Core'}
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, gap: "20px", overflow: "hidden" }}>
        {/* List */}
        <div style={{ width: "240px", borderRight: "1px solid #30363d", overflowY: "auto" }}>
          {chronicles.length === 0 && <div style={{ fontSize: "12px", color: "#8b949e" }}>No chronicles found.</div>}
          {chronicles.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelected(c)}
              style={{ padding: "10px", borderBottom: "1px solid #21262d", cursor: "pointer", backgroundColor: selected?.id === c.id ? "#161b22" : "transparent" }}
            >
              <div style={{ fontSize: "13px", fontWeight: "bold", color: selected?.id === c.id ? "#58a6ff" : "#c9d1d9" }}>
                {c.project?.name || 'House of Qui'}
              </div>
              <div style={{ fontSize: "10px", color: "#8b949e" }}>ID: {c.project?.id || 'CORE'}</div>
            </div>
          ))}
        </div>

        {/* Viewer */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px", backgroundColor: "#010409", borderRadius: "8px" }}>
            {selected ? (
                <div>
                   <div style={{ whiteSpace: "pre-wrap", fontSize: "13px", lineHeight: "1.6" }}>
                      {selected.content}
                   </div>
                   <div style={{ marginTop: "30px" }}>
                      <h4 style={{ fontSize: "14px", color: "#58a6ff", borderBottom: "1px solid #30363d", paddingBottom: "8px" }}>Architectural Blueprint (Mermaid)</h4>
                      <pre style={{ backgroundColor: "#0d1117", padding: "12px", borderRadius: "6px", fontSize: "11px", color: "#79c0ff", overflowX: "auto" }}>
                        {selected.diagram}
                      </pre>
                   </div>
                </div>
            ) : (
                <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "#484f58", fontStyle: "italic" }}>
                    Select a chronicle to observe the imperial record.
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
