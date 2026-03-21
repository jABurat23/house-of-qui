import React from "react"
import type { Project } from "../types/project"
import { useState } from "react"
import DeploymentsModal from "./DeploymentsModal"
import ProjectMetrics from "./ProjectMetrics"
import ArchivePanel from "./ArchivePanel"

interface Props {
  projects: Project[]
}

export default function ProjectTable({ projects }: Props) {
  const [deployProject, setDeployProject] = useState<{ id: string, name: string } | null>(null)
  const [showArchive, setShowArchive] = useState<string | null>(null)

  return (
    <div style={{ background: "rgba(10, 20, 40, 0.4)", padding: "24px", borderRadius: "8px", border: "1px solid rgba(0, 195, 255, 0.2)", backdropFilter: "blur(5px)" }}>
      <h3 style={{ margin: "0 0 20px 0", color: "#00c3ff", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Imperial Project Registry</h3>
      
      {projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", opacity: 0.5 }}>
            <p>No projects registered in the Imperial Archives yet.</p>
            <code style={{ background: "#000", padding: "4px 8px", borderRadius: "4px", color: "#00c3ff" }}>qui register --prime</code>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", textTransform: "uppercase" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "normal" }}>Project Artifact</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "normal" }}>Mandate v.</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "normal" }}>Sovereign Status</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "normal" }}>Registry ID</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: "normal" }}>Operations</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p) => (
                <React.Fragment key={p.id}>
                  <tr style={{ backgroundColor: "rgba(0, 195, 255, 0.03)", backdropFilter: "blur(2px)", transition: "all 0.2s ease" }}>
                    <td style={{ padding: "16px", borderTop: "1px solid rgba(0,195,255,0.1)", borderBottom: "1px solid rgba(0,195,255,0.1)", borderLeft: "1px solid rgba(0,195,255,0.1)", borderRadius: "6px 0 0 6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.status === "active" ? "#00ff88" : "#ff3366", boxShadow: `0 0 8px ${p.status === "active" ? "#00ff88" : "#ff3366"}` }} />
                        <span style={{ fontWeight: "bold", color: "#e0e6ed" }}>{p.name}</span>
                        {p.signature && (
                          <span title="Cryptographically Sealed" style={{ fontSize: "14px", cursor: "help" }}>🔏</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px", borderTop: "1px solid rgba(0,195,255,0.1)", borderBottom: "1px solid rgba(0,195,255,0.1)" }}>
                      <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", color: "#00c3ff" }}>v{p.version || "0.0.0"}</code>
                    </td>
                    <td style={{ padding: "16px", borderTop: "1px solid rgba(0,195,255,0.1)", borderBottom: "1px solid rgba(0,195,255,0.1)" }}>
                      <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        <span style={{ color: p.status === "active" ? "#00ff88" : "#ff3366" }}>{p.status}</span>
                        {p.health && (
                          <div style={{ marginTop: "6px", width: "100px" }}>
                            <div style={{ height: "3px", width: "100%", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${p.health.score}%`, backgroundColor: p.health.score > 90 ? "#00ff88" : "#ffcc00" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "16px", borderTop: "1px solid rgba(0,195,255,0.1)", borderBottom: "1px solid rgba(0,195,255,0.1)", fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                      {p.id?.substring(0, 13)}
                    </td>
                    <td style={{ padding: "16px", borderTop: "1px solid rgba(0,195,255,0.1)", borderBottom: "1px solid rgba(0,195,255,0.1)", borderRight: "1px solid rgba(0,195,255,0.1)", borderRadius: "0 6px 6px 0", textAlign: "right" }}>
                      <button
                        onClick={() => setDeployProject({ id: p.id!, name: p.name })}
                        style={{ padding: "6px 12px", background: "transparent", border: "1px solid #00c3ff", color: "#00c3ff", borderRadius: "4px", fontSize: "11px", cursor: "pointer", transition: "all 0.2s", marginRight: "8px", textTransform: "uppercase" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 195, 255, 0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        Deployments
                      </button>
                      <button
                        onClick={() => setShowArchive(showArchive === p.id ? null : p.id)}
                        style={{ padding: "6px 12px", background: "#00c3ff", border: "none", color: "#000", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase" }}
                      >
                         {showArchive === p.id ? "Close" : "Archive"}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Metrics & Archive */}
                  {(showArchive === p.id) && (
                    <tr>
                      <td colSpan={5} style={{ padding: "0 10px 10px 10px" }}>
                        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "0 0 8px 8px", border: "1px solid rgba(0, 195, 255, 0.05)", borderTop: "none" }}>
                             <ProjectMetrics projectId={p.id!} />
                             {showArchive === p.id && <div style={{ padding: "10px" }}><ArchivePanel projectId={p.id!} /></div>}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deployProject && (
        <DeploymentsModal
          projectId={deployProject.id}
          projectName={deployProject.name}
          onClose={() => setDeployProject(null)}
        />
      )}
    </div>
  )
}