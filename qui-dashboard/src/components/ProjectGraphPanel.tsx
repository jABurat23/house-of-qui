import { useEffect, useState, useRef } from "react"
import { api } from "../api/client"

interface Node {
  id: string
  label: string
  type: string
  x: number
  y: number
  vx: number
  vy: number
  fx?: number | null
  fy?: number | null
  requiredRole?: string
  content?: string
  fullPath?: string
}

interface Link {
  source: string
  target: string
  weight: number
  type?: string
}

export default function ProjectGraphPanel() {
  const [universeData, setUniverseData] = useState<{ nodes: Node[], links: Link[] }>({ nodes: [], links: [] })
  const [viewMode, setViewMode] = useState<'universe' | 'code'>('universe')
  const [codeData, setCodeData] = useState<{ nodes: Node[], links: Link[] }>({ nodes: [], links: [] })
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [imperialRole, setImperialRole] = useState('OPERATOR')
  const [activeCode, setActiveCode] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 })

  const [visibleNodeTypes, setVisibleNodeTypes] = useState<Record<string, boolean>>({
    standard: true,
    shadow: true,
    core: true,
    source_file: true
  })

  useEffect(() => {
    fetchUniverse()
    if (containerRef.current) {
      setDimensions({ width: containerRef.current.clientWidth, height: 600 })
    }
  }, [imperialRole])

  async function fetchUniverse() {
    try {
      const res = await api.get("/monarch/cartographer/graph", {
        headers: { 'x-imperial-role': imperialRole }
      })
      const nodes = res.data.nodes.map((n: any) => ({
        ...n,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 0,
        vy: 0,
        // Fix House of Qui to center if universe
        fx: n.id === 'HOUSE_OF_QUI_CORE' ? 400 : null,
        fy: n.id === 'HOUSE_OF_QUI_CORE' ? 300 : null
      }))
      setUniverseData({ nodes, links: res.data.links })
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchCodeGraph(projectId: string) {
    try {
      const res = await api.get(`/monarch/cartographer/code/${projectId}`, {
        headers: { 'x-imperial-role': imperialRole }
      })
      const nodes = res.data.nodes.map((n: any) => ({
        ...n,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 0,
        vy: 0
      }))
      setCodeData({ nodes, links: res.data.links })
      setViewMode('code')
      setCurrentProjectId(projectId)
    } catch (err: any) {
        alert(err.response?.data?.message || "Imperial Blockade Encountered")
    }
  }

  // Force simulation loop
  useEffect(() => {
    const currentNodes = viewMode === 'universe' ? universeData.nodes : codeData.nodes
    const currentLinks = viewMode === 'universe' ? universeData.links : codeData.links
    
    if (currentNodes.length === 0) return

    let animationId: number
    const nodes = [...currentNodes]
    const links = currentLinks

    const step = () => {
      const center = { x: dimensions.width / 2, y: dimensions.height / 2 }

      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distSq = dx * dx + dy * dy + 0.1
          const force = (viewMode === 'code' ? 600 : 1000) / distSq
          
          const fx = (dx / Math.sqrt(distSq)) * force
          const fy = (dy / Math.sqrt(distSq)) * force
          
          if (nodes[i].fx === null) { nodes[i].vx += fx; nodes[i].vy += fy; }
          if (nodes[j].fx === null) { nodes[j].vx -= fx; nodes[j].vy -= fy; }
        }
      }

      // Attraction
      links.forEach(link => {
        const s = nodes.find(n => n.id === (typeof link.source === 'string' ? link.source : (link.source as any).id))
        const t = nodes.find(n => n.id === (typeof link.target === 'string' ? link.target : (link.target as any).id))
        if (s && t) {
          const dx = t.x - s.x
          const dy = t.y - s.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const force = (dist - (viewMode === 'code' ? 60 : 150)) * 0.03
          
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          
          if (s.fx === null) { s.vx += fx; s.vy += fy; }
          if (t.fx === null) { t.vx -= fx; t.vy -= fy; }
        }
      })

      // Update positions
      nodes.forEach(n => {
        if (n.fx !== null && n.fx !== undefined) {
             n.x = n.fx
             n.y = n.fy!
             return
        }

        n.vx += (center.x - n.x) * 0.005
        n.vy += (center.y - n.y) * 0.005
        n.vx *= 0.9
        n.vy *= 0.9
        n.x += n.vx
        n.y += n.vy
        
        n.x = Math.max(20, Math.min(dimensions.width - 20, n.x))
        n.y = Math.max(20, Math.min(dimensions.height - 20, n.y))
      })

      if (viewMode === 'universe') setUniverseData(prev => ({ ...prev, nodes: [...nodes] }))
      else setCodeData(prev => ({ ...prev, nodes: [...nodes] }))
      
      animationId = requestAnimationFrame(step)
    }

    animationId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationId)
  }, [universeData.links, codeData.links, viewMode, dimensions.width])

  const handleNodeClick = (node: Node) => {
    if (viewMode === 'universe') {
        fetchCodeGraph(node.id)
    } else {
        setSelectedNode(node)
        if (node.type === 'source_file') {
            setActiveCode(node.content || null)
        }
    }
  }

  const activeNodes = (viewMode === 'universe' ? universeData.nodes : codeData.nodes)
    .filter(n => visibleNodeTypes[n.type] !== false)
  const activeLinks = (viewMode === 'universe' ? universeData.links : codeData.links)
    .filter(l => {
        const s = typeof l.source === 'string' ? l.source : (l.source as any).id
        const t = typeof l.target === 'string' ? l.target : (l.target as any).id
        return activeNodes.some(n => n.id === s) && activeNodes.some(n => n.id === t)
    })

  return (
    <div style={{ display: "flex", backgroundColor: "#010409", color: "#c9d1d9", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", borderRadius: "12px", border: "1px solid #30363d", overflow: "hidden", height: "700px" }}>
      
      {/* Sidebar Wrapper */}
      <div style={{ width: "260px", backgroundColor: "#0d1117", borderRight: "1px solid #30363d", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "18px", margin: 0, color: "#58a6ff" }}>{viewMode === 'universe' ? 'Universe Cartographer' : 'Code Nexus View'}</h2>
        
        <div>
           <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "8px", textTransform: "uppercase", fontWeight: "bold" }}>Imperial Mandate</div>
           <select 
             value={imperialRole} 
             onChange={(e) => setImperialRole(e.target.value)}
             style={{ width: "100%", backgroundColor: "#161b22", color: "#c9d1d9", border: "1px solid #30363d", padding: "8px", borderRadius: "6px" }}
           >
             <option value="VISITOR">VISITOR</option>
             <option value="OPERATOR">OPERATOR</option>
             <option value="ARCHIVIST">ARCHIVIST</option>
             <option value="OVERSEER">OVERSEER</option>
           </select>
        </div>

        <div>
            <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "12px", textTransform: "uppercase", fontWeight: "bold" }}>Node Filters</div>
            {Object.keys(visibleNodeTypes).map(type => (
                <label key={type} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", cursor: "pointer", fontSize: "13px" }}>
                    <input 
                      type="checkbox" 
                      checked={visibleNodeTypes[type]} 
                      onChange={() => setVisibleNodeTypes(p => ({ ...p, [type]: !p[type] }))}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </label>
            ))}
        </div>

        <div style={{ marginTop: "auto" }}>
            {viewMode === 'code' && (
                <button 
                  onClick={() => { setViewMode('universe'); setCodeData({nodes:[], links:[]}) }}
                  style={{ width: "100%", padding: "10px", backgroundColor: "#21262d", border: "1px solid #30363d", color: "#c9d1d9", borderRadius: "6px", cursor: "pointer" }}
                >
                  Return to Universe
                </button>
            )}
        </div>
      </div>

      {/* Main Graph Area */}
      <div ref={containerRef} style={{ flex: 1, position: "relative" }}>
        
        {/* Breadcrumb / Status */}
        <div style={{ position: "absolute", top: "15px", left: "15px", zIndex: 5, fontSize: "12px", color: "#8b949e" }}>
            {viewMode === 'universe' ? 'Global System Grid' : `Drilldown: ${universeData.nodes.find(n => n.id === currentProjectId)?.label || 'Unknown'}`}
        </div>

        <svg width="100%" height="100%" style={{ cursor: "grab" }}>
          <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <radialGradient id="codeGrad">
              <stop offset="0%" stopColor="#79c0ff" />
              <stop offset="100%" stopColor="#1f6feb" />
            </radialGradient>
            <radialGradient id="coreGrad">
              <stop offset="0%" stopColor="#ffd33d" />
              <stop offset="100%" stopColor="#d29922" />
            </radialGradient>
          </defs>

          {/* Lines */}
          {activeLinks.map((link, i) => {
             const s = activeNodes.find(n => n.id === (typeof link.source === 'string' ? link.source : (link.source as any).id))
             const t = activeNodes.find(n => n.id === (typeof link.target === 'string' ? link.target : (link.target as any).id))
             if (!s || !t) return null
             return (
               <line 
                 key={i} 
                 x1={s.x} y1={s.y} x2={t.x} y2={t.y} 
                 stroke="#30363d" 
                 strokeWidth={viewMode === 'code' ? 1.5 : (1 + link.weight * 0.5)} 
                 opacity={0.6}
               />
             )
          })}

          {/* Nodes */}
          {activeNodes.map(node => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onClick={() => handleNodeClick(node)} style={{ cursor: "pointer" }}>
               <circle 
                 r={node.type === 'core' ? 18 : 10} 
                 fill={node.type === 'core' ? "url(#coreGrad)" : (node.type === 'shadow' ? "#f85149" : "url(#codeGrad)")}
                 filter="url(#glow)"
               />
               <text 
                 y={22} 
                 textAnchor="middle" 
                 fill="#8b949e" 
                 style={{ fontSize: "10px", pointerEvents: "none", userSelect: "none" }}
               >
                 {node.label}
               </text>
               {node.requiredRole === 'OVERSEER' && (
                  <circle r={24} fill="none" stroke="#d29922" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
               )}
            </g>
          ))}
        </svg>

        {/* Code View Slide-over */}
        {activeCode && (
           <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "400px", backgroundColor: "#161b22", borderLeft: "1px solid #30363d", padding: "20px", zIndex: 20, boxShadow: "-5px 0 15px rgba(0,0,0,0.5)", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <h3 style={{ margin: 0, fontSize: "14px", color: "#58a6ff" }}>{selectedNode?.label}</h3>
                  <button onClick={() => setActiveCode(null)} style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer" }}>✕</button>
              </div>
              <pre style={{ margin: 0, fontSize: "12px", color: "#c9d1d9", backgroundColor: "#0d1117", padding: "10px", borderRadius: "6px", border: "1px solid #30363d", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  {activeCode}
              </pre>
              <div style={{ marginTop: "20px", fontSize: "11px", color: "#8b949e", fontStyle: "italic" }}>
                  Imperial Scanner identified {selectedNode?.label?.split('.').pop()?.toUpperCase()} module.
              </div>
           </div>
        )}
      </div>

    </div>
  )
}
