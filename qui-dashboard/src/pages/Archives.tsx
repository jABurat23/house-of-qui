import { motion } from "framer-motion";
import { Database, Search, ShieldAlert } from "lucide-react";

interface ArchivesProps {
  logs: any[];
}

export default function Archives({ logs }: ArchivesProps) {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between mb-4 border-b border-primary/10 pb-6 shrink-0">
         <div>
            <h2 className="text-xl font-cinzel tracking-[4px] uppercase font-bold text-primary mb-1">Grand Archives</h2>
            <p className="text-[10px] uppercase opacity-40">Consulting the Eternal Chronicle of House of Qui</p>
         </div>
         <div className="flex gap-4">
            <div className="bg-black/40 border border-primary/20 rounded-lg px-4 py-2 flex items-center gap-3">
               <Search className="w-3 h-3 text-primary" />
               <input type="text" placeholder="FILTER ARCHIVES..." className="bg-transparent border-none text-[10px] uppercase outline-none w-32 tracking-widest opacity-60" />
            </div>
            <button className="imperial-btn text-[10px] py-2 px-6 hover:scale-105 transition-transform duration-500 whitespace-nowrap">Expunge Records</button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin">
        <div className="flex flex-col gap-3">
          {logs.map((log, i) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 bg-black/20 border border-primary/10 rounded-xl hover:border-primary/40 transition-all group flex items-start gap-6 ${log.level === 'critical' ? 'border-red-500/30 bg-red-500/5' : ''}`}
            >
              <div className={`p-3 rounded-lg bg-black/40 border border-primary/10 ${log.level === 'critical' ? 'text-red-500 border-red-500/20 shadow-neon-red' : 'text-primary'}`}>
                {log.level === 'critical' ? <ShieldAlert className="w-4 h-4" /> : <Database className="w-4 h-4" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                   <div className="text-[10px] uppercase tracking-[2px] font-bold text-primary group-hover:text-white transition-colors">{log.action}</div>
                   <div className="text-[9px] font-mono opacity-20">{new Date(log.timestamp).toLocaleTimeString()} — {new Date(log.timestamp).toLocaleDateString()}</div>
                </div>
                <div className="text-[11px] opacity-40 group-hover:opacity-80 transition-opacity">
                   {log.metadata?.message || log.metadata?.projectName || "System Command Executed"}
                </div>
                {log.metadata?.action && (
                   <div className="mt-3 text-[9px] uppercase tracking-widest text-accent/60 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-accent" />
                      Protocol: {log.metadata.action}
                   </div>
                )}
              </div>

              <div className="text-[9px] uppercase tracking-widest opacity-20 group-hover:opacity-40 select-none font-cinzel">Ref: {log.id.substring(0, 8)}</div>
            </motion.div>
          ))}
          {logs.length === 0 && (
             <div className="h-60 flex flex-col items-center justify-center border border-dashed border-primary/20 rounded-xl opacity-20 italic gap-4">
                <Database className="w-8 h-8 opacity-40 animate-pulse" />
                <span>The Archives are silent...</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
