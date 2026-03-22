import { motion } from "framer-motion";

import { Zap, Activity, ShieldCheck, Box } from "lucide-react";

interface ThroneProps {
  projects: any[];
}

export default function Throne({ projects }: ThroneProps) {
  
  const stats = [
    { label: "Imperial Pulse", value: "98.4%", icon: Zap, color: "text-accent" },
    { label: "Active Mandates", value: projects.length, icon: Box, color: "text-primary" },
    { label: "Security Status", value: "Sovereign", icon: ShieldCheck, color: "text-green-500" },
    { label: "System Load", value: "0.4%", icon: Activity, color: "text-primary/60" },
  ];

  return (
    <div className="flex flex-col gap-10">
      
      {/* 🔮 Imperial Stats: "Pulse Monitor" */}
      <div className="grid grid-cols-4 gap-6 shrink-0">
        {stats.map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="imperial-panel p-8 group hover:bg-white/5 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 rounded-xl bg-black/40 border border-primary/20 ${s.color}`}>
                 <s.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 shrink-0">
                <h4 className="text-[10px] uppercase tracking-[3px] opacity-40 group-hover:opacity-80 transition-opacity whitespace-nowrap">{s.label}</h4>
                <div className="text-2xl font-cinzel tracking-widest font-bold whitespace-nowrap shrink-0">{s.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🛡️ Active Mandates: "Dominion Status" */}
      <div className="imperial-panel p-10 flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4 border-b border-primary/10 pb-6 shrink-0">
           <div>
              <h2 className="text-xl font-cinzel tracking-[4px] uppercase font-bold text-primary mb-1">Dominion Status</h2>
              <p className="text-[10px] uppercase opacity-40">Active Project Mandates across House of Qui</p>
           </div>
           <button className="imperial-btn text-[10px] py-2 px-6 hover:scale-105 transition-transform duration-500 whitespace-nowrap shrink-0">Archive Records</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="bg-black/20 border border-primary/10 p-6 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <div className="mb-4 relative z-10">
                <h4 className="font-cinzel text-sm tracking-widest text-primary truncate group-hover:text-white transition-colors">{p.name || "UNNAMED_PROJECT"}</h4>
                <p className="text-[9px] uppercase opacity-40 mt-1 truncate">ID: {p.id.substring(0, 18)}...</p>
              </div>
              
              <div className="flex items-center gap-4 relative z-10 bg-black/40 p-3 rounded-lg border border-primary/5">
                <div className="flex-1 shrink-0 whitespace-nowrap">
                   <div className="text-[8px] uppercase opacity-30 pb-1">Signature Verified</div>
                   <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-neon-cyan" />
                       <span className="text-[10px] uppercase text-accent font-bold tracking-widest whitespace-nowrap shrink-0">{p.signature ? 'Great Seal' : 'Insecure'}</span>
                   </div>
                </div>
                <div className="w-px h-8 bg-primary/10" />
                <div className="flex-1 shrink-0 whitespace-nowrap">
                    <div className="text-[8px] uppercase opacity-30 pb-1">Protocols</div>
                    <div className="text-[10px] font-bold text-white/60 whitespace-nowrap shrink-0">{p.isShadow ? 'SHADOW' : 'VISIBLE'}</div>
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
             <div className="col-span-3 h-40 flex items-center justify-center border border-dashed border-primary/20 rounded-xl opacity-20 italic">
                No mandates active in the current cycle.
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
