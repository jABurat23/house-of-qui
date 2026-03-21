import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Zap, Radio, Terminal, AlertTriangle } from "lucide-react";

interface WarCouncilProps {
  logs: any[];
}

export default function WarCouncil({ logs }: WarCouncilProps) {
  const alerts = logs.filter(l => l.level === 'critical' || l.action === 'SHADOW_INTRUSION_DETECTED');

  const threats = [
    { label: "Active Probes", value: "247", icon: Radio, trend: "+12%" },
    { label: "Identity Challenges", value: "1,402", icon: ShieldAlert, trend: "-2%" },
    { label: "Shadow Intrusion Attempts", value: alerts.length, icon: Zap, trend: "+100%" },
    { label: "Threat Level", value: alerts.length > 5 ? "ELEVATED" : "CONTROLLED", icon: AlertTriangle, color: alerts.length > 5 ? "text-red-500 shadow-neon-red" : "text-green-500 shadow-neon-cyan" },
  ];

  return (
    <div className="flex flex-col h-full gap-8 overflow-y-auto pr-4 scrollbar-thin">
      
      {/* 🔮 Security Pulse: "Battle Indicators" */}
      <div className="grid grid-cols-4 gap-6 shrink-0 pt-2">
        {threats.map((t, i) => (
          <motion.div 
            key={t.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="imperial-panel p-8 group hover:bg-red-500/5 transition-all duration-500 relative overflow-hidden"
          >
            {t.label === "Threat Level" && (
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 ${alerts.length > 5 ? 'bg-red-500' : 'bg-green-500'}`} />
            )}
            <div className={`p-4 rounded-xl border border-primary/20 mb-4 inline-block ${t.color || 'text-primary'}`}>
                <t.icon className="w-5 h-5 shadow-neon-cyan" />
            </div>
            <h4 className="text-[9px] uppercase tracking-[3px] opacity-40 group-hover:opacity-80 transition-opacity whitespace-nowrap">{t.label}</h4>
            <div className={`text-2xl font-cinzel font-bold tracking-widest ${t.color || 'text-white'} truncate`}>{t.value}</div>
            <div className={`text-[8px] uppercase font-bold mt-2 ${t.trend.startsWith('+') ? 'text-red-500/60' : 'text-green-500/60'}`}>{t.trend} vs LAST CYCLE</div>
          </motion.div>
        ))}
      </div>

      {/* 🛡️ War Room: "Battle Records" */}
      <div className="imperial-panel flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6 shrink-0">
           <div>
              <h2 className="text-xl font-cinzel tracking-[4px] uppercase font-bold text-red-500 shadow-neon-red mb-1">Battle Records</h2>
              <p className="text-[10px] uppercase opacity-40">Intelligence reports on shadow intrusions and identity rituals</p>
           </div>
           <button className="imperial-btn text-[10px] py-2 px-6 hover:scale-105 transition-transform duration-500 whitespace-nowrap hover:bg-red-500/10 hover:border-red-500/60">Intercept Signal</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {alerts.map((a, i) => (
            <motion.div 
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (i * 0.05) }}
              className="p-5 bg-black/40 border-l-4 border-l-red-500 border-r border-y border-red-500/10 rounded-r-xl flex items-center gap-6 group hover:translate-x-2 transition-transform duration-500"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-neon-red">
                 <Terminal className="w-4 h-4" />
              </div>
              <div className="flex-1">
                 <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{a.action}</span>
                    <span className="text-[9px] font-mono opacity-20 uppercase">{new Date(a.timestamp).toLocaleTimeString()} — SEC_CORE_ALPHA</span>
                 </div>
                 <p className="text-[11px] text-white/70 overflow-hidden text-ellipsis whitespace-nowrap w-2/3">
                    Detected unauthorized access attempt from <span className="text-accent underline cursor-crosshair">{a.ipAddress || "ANON_ID"}</span> in {a.metadata?.projectName || 'Core Sectors'}.
                 </p>
              </div>
              <div className="bg-red-500/20 text-red-400 text-[8px] px-3 py-1 rounded font-bold uppercase tracking-widest">Intercepted</div>
            </motion.div>
          ))}
          {alerts.length === 0 && (
             <div className="h-40 flex items-center justify-center border border-dashed border-red-500/10 rounded-xl text-red-500/40 text-xs italic">
                Scanning for threat vectors... No recent intrusions detected.
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
