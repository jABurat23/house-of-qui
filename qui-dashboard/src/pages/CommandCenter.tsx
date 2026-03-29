import { useEffect, useState } from "react";
import { Terminal, Send, Clock } from "lucide-react";
import { api } from "../api/client";
import { motion } from "framer-motion";
import type { Project } from "../types";

export default function CommandCenter() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    // Phase V Command Center requires a list of projects and command history
    api.get("/monarch/projects").then(res => setProjects(res.data)).catch(() => {});
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000); // refresh history every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/monarch/command/history");
      setHistory(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const executeCommand = async () => {
    if (!selectedProject || !command.trim()) return;
    setExecuting(true);
    try {
      await api.post(`/monarch/command/remote/${selectedProject}`, { command });
      setCommand("");
      await fetchHistory();
    } catch (err) {
      console.error("Execution failed.");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 overflow-y-auto pr-4 scrollbar-thin">
      
      {/* Remote Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

        {/* Command Terminal (Phase V) */}
        <div className="imperial-panel p-8 flex flex-col h-[600px]">
          <div className="flex items-center gap-3 border-b border-primary/10 pb-6 shrink-0 mb-6">
            <Terminal className="w-5 h-5 text-accent" />
            <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-accent">
              Remote Executive
            </h2>
            <div className="ml-auto flex items-center gap-2 text-[9px] uppercase tracking-widest text-primary/40 p-2 border border-primary/10 rounded-lg">
              Target: {selectedProject ? projects.find(p => p.id === selectedProject)?.name : "NONE"}
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <div className="w-1/3">
              <label className="text-[10px] uppercase opacity-40 mb-2 block tracking-widest">Select Mandate</label>
              <select 
                className="w-full bg-black/40 border border-primary/20 rounded-lg p-2 text-xs font-mono outline-none focus:border-accent/40"
                value={selectedProject || ""}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="" disabled>-- CHOOSE TARGET --</option>
                {projects.map(p => (
                   <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="w-2/3">
               <label className="text-[10px] uppercase opacity-40 mb-2 block tracking-widest">Imperial Directive</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={command} 
                   onChange={(e) => setCommand(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && executeCommand()}
                   placeholder="e.g. system:restart" 
                   className="flex-1 bg-black/40 border border-primary/20 rounded-lg px-4 py-2 text-xs font-mono text-primary outline-none focus:border-accent/40"
                 />
                 <button 
                   onClick={executeCommand}
                   disabled={executing || !selectedProject || !command.trim()}
                   className="imperial-btn px-6 disabled:opacity-50 flex items-center gap-2"
                 >
                   {executing ? <Terminal className="w-4 h-4 animate-spin text-accent" /> : <Send className="w-4 h-4" />}
                 </button>
               </div>
            </div>
          </div>

          <div className="flex-1 bg-black text-green-500/80 p-4 border border-x-accent/20 border-y-primary/20 rounded-xl font-mono text-xs overflow-y-auto">
            <div className="opacity-40 mb-2">// IMPERIAL COMMAND LINK ESTABLISHED</div>
            <div className="opacity-40 mb-6">// AWAITING DIRECTIVES...</div>
            {history
              .filter(h => h.projectId === selectedProject)
              .slice(0, 5)
              .map((h) => (
              <div key={h.id} className="mb-4">
                <div className="flex gap-2 text-white/40">
                   <div className="w-2 h-2 mt-1 rounded-full bg-accent animate-pulse shrink-0" />
                   <div>
                     $ {h.command} 
                     <span className="opacity-30 text-[9px] ml-4">
                       [{new Date(h.issuedAt || h.createdAt || Date.now()).toLocaleTimeString()}]
                     </span>
                   </div>
                </div>
                <div className={`mt-1 pl-4 ${h.status === 'failed' ? 'text-red-500' : 'text-green-500/60'}`}>
                  &gt; STATUS: {h.status.toUpperCase()}
                  <br />
                  &gt; {h.output || "No output registered."}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Command Execution Log */}
        <div className="imperial-panel p-8 flex flex-col h-[600px]">
           <div className="flex items-center gap-3 border-b border-primary/10 pb-6 shrink-0 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-primary">
              Execution Chronicle
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {history.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 bg-black/20 border-l-[3px] border-r border-y rounded-r-xl transition-all ${
                  h.status === 'failed' 
                    ? "border-l-red-500 border-red-500/10 hover:bg-red-500/5 text-red-500" 
                    : h.status === 'success' || h.status === 'completed'
                    ? "border-l-green-500 border-green-500/10 hover:bg-green-500/5 text-green-500"
                    : "border-l-accent border-accent/10 hover:bg-accent/5 text-accent"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                    Target: {h.projectId?.substring(0,8) || h.targetProjectId?.substring(0,8) || "SYSTEM"}...
                  </div>
                  <div className="text-[9px] font-mono opacity-40 text-white/40">
                    {new Date(h.issuedAt || h.createdAt || Date.now()).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-xs font-mono font-bold tracking-wider mb-2">
                  $ {h.command}
                </div>
                <div className="text-[9px] uppercase tracking-widest opacity-60">
                   STATUS: [{h.status}]
                </div>
              </motion.div>
            ))}
            {!loading && history.length === 0 && (
              <div className="h-full flex items-center justify-center border border-dashed border-primary/10 rounded-xl opacity-20 italic text-xs">
                 No commands have been executed in this cycle.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
