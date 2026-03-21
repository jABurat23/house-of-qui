import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hammer, Cpu, Package, Settings, ToggleRight } from "lucide-react";
import { api } from "../api/client";

export default function Forge() {
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlugins = async () => {
       try {
          const res = await api.get("/plugins");
          setPlugins(res.data);
       } catch (err) {
          console.error("The Forge is cold.", err);
       } finally {
          setLoading(false);
       }
    };
    fetchPlugins();
  }, []);

  if (loading) return (
     <div className="h-full flex items-center justify-center opacity-20 italic">
        Igniting the Forge...
     </div>
  );

  const stats = [
    { label: "Active Constructs", value: plugins.length, icon: Cpu },
    { label: "Subsystem Load", value: "1.2%", icon: Settings },
    { label: "Protocol Versions", value: "v2.0.4", icon: Package },
    { label: "Forge Status", value: "OPERATIONAL", icon: Hammer },
  ];

  return (
    <div className="flex flex-col h-full gap-8 overflow-y-auto pr-4 scrollbar-thin">
      
      {/* 🔮 Forge Stats: "Subsystem Pulse" */}
      <div className="grid grid-cols-4 gap-6 shrink-0 pt-2">
        {stats.map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="imperial-panel p-8 group hover:bg-white/5 transition-all duration-500"
          >
            <div className="p-4 rounded-xl border border-primary/10 mb-4 inline-block text-primary group-hover:text-accent transition-colors">
                <s.icon className="w-5 h-5 shadow-neon-cyan" />
            </div>
            <h4 className="text-[9px] uppercase tracking-[3px] opacity-40 group-hover:opacity-80 transition-opacity whitespace-nowrap">{s.label}</h4>
            <div className="text-2xl font-cinzel font-bold tracking-widest text-white">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* 🛡️ Construct List: "Imperial Artifacts" */}
      <div className="imperial-panel flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6 shrink-0">
           <div>
              <h2 className="text-xl font-cinzel tracking-[4px] uppercase font-bold text-primary mb-1">Imperial Artifacts</h2>
              <p className="text-[10px] uppercase opacity-40">System-level constructs and protocol modules</p>
           </div>
           <button className="imperial-btn text-[10px] py-2 px-6 hover:scale-105 transition-transform duration-500 whitespace-nowrap">Synchronize All</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {plugins.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.05) }}
              className="p-6 bg-black/20 border border-primary/10 rounded-xl flex items-center justify-between group hover:bg-accent/5 hover:border-accent/30 transition-all duration-500"
            >
              <div className="flex items-center gap-6">
                 <div className="p-3 rounded-lg bg-black/40 border border-primary/10 text-primary group-hover:text-accent transition-colors">
                    <Package className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs font-cinzel tracking-widest text-primary mb-1 group-hover:text-accent">{p.name} <span className="text-[9px] opacity-30 font-mono italic">v{p.version}</span></div>
                    <div className="text-[10px] opacity-50 tracking-widest uppercase truncate max-w-sm">{p.description || 'System Protocol Mandate'}</div>
                 </div>
              </div>

              <div className="flex items-center gap-8">
                 <div className="text-right">
                    <div className="text-[9px] uppercase opacity-30 pb-1">Status</div>
                    <div className={`text-[10px] font-bold tracking-widest flex items-center gap-2 justify-end ${p.enabled ? 'text-accent' : 'opacity-20'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${p.enabled ? 'bg-accent animate-pulse' : 'bg-white'}`} />
                       {p.enabled ? 'STABLE' : 'DORMANT'}
                    </div>
                 </div>
                 <button className="p-3 rounded-lg bg-black/40 border border-primary/10 text-primary/40 hover:text-accent hover:border-accent transition-all">
                    <ToggleRight className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
