import { useEffect, useState, useRef } from "react"
import { socket } from "../api/socket"
import { api } from "../api/client"

interface Project {
  id: string
  name: string
}

export default function ImperialCommandPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadProjects() {
      const res = await api.get("/monarch/projects")
      setProjects(res.data)
      if (res.data.length > 0) setSelectedProjectId(res.data[0].id)
    }
    loadProjects()
  }, [])

  useEffect(() => {
    const handleOutput = (data: { commandId: string, chunk: string }) => {
      setOutput(prev => prev + data.chunk)
    }

    const handleCompleted = () => {
      setIsExecuting(false)
      setOutput(prev => prev + "\n[COMMAND COMPLETED]\n")
    }

    socket.on("command_output", handleOutput)
    socket.on("command_completed", handleCompleted)

    return () => {
      socket.off("command_output")
      socket.off("command_completed")
    }
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleRunCommand = async () => {
    if (!selectedProjectId || !command) return

    setIsExecuting(true)
    setOutput(`> Initiating command on ${selectedProjectId}...\n`)

    try {
      await api.post(`/monarch/command/remote/${selectedProjectId}`, { command })
    } catch (err) {
      setOutput(prev => prev + `\n❌ ERROR: Failed to dispatch command.\n`)
      setIsExecuting(false)
    }
  }

  return (
    <div style={{ backgroundColor: "#0c0c0c", border: "1px solid #00ff41", borderRadius: "8px", padding: "16px", color: "#00ff41", fontFamily: "'Courier New', Courier, monospace" }}>
      <h3 style={{ margin: "0 0 16px 0", color: "#00ff41", borderBottom: "1px solid #00ff41", paddingBottom: "8px", textTransform: "uppercase" }}>
        ⌨️ Imperial Command Center
      </h3>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <select 
          value={selectedProjectId} 
          onChange={(e) => setSelectedProjectId(e.target.value)}
          style={{ backgroundColor: "#000", color: "#00ff41", border: "1px solid #00ff41", padding: "6px", flex: 1 }}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        
        <input 
          type="text" 
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command (e.g. system_check, rebuild, vault_seal)..."
          style={{ backgroundColor: "#000", color: "#00ff41", border: "1px solid #00ff41", padding: "6px", flex: 3 }}
          onKeyPress={(e) => e.key === 'Enter' && handleRunCommand()}
        />
        
        <button 
          onClick={handleRunCommand} 
          disabled={isExecuting}
          style={{ 
            backgroundColor: isExecuting ? "#111" : "#003b00", 
            color: "#00ff41", 
            border: "1px solid #00ff41", 
            padding: "6px 20px",
            cursor: isExecuting ? "not-allowed" : "pointer"
          }}
        >
          {isExecuting ? "RUNNING..." : "EXECUTE"}
        </button>
      </div>
      
      <div 
        ref={outputRef}
        style={{ 
          backgroundColor: "#000", 
          border: "1px solid #003b00", 
          borderRadius: "4px", 
          padding: "12px", 
          height: "200px", 
          overflowY: "auto", 
          whiteSpace: "pre-wrap",
          fontSize: "13px",
          lineHeight: "1.4"
        }}
      >
        {output || "Awaiting target acquisition..."}
        {isExecuting && <span className="cursor" style={{ marginLeft: "4px", backgroundColor: "#00ff41", width: "8px", height: "14px", display: "inline-block" }}></span>}
      </div>

      <style>
        {`
          .cursor {
            animation: blink 1s infinite step-end;
          }
          @keyframes blink {
            from, to { opacity: 0; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}
