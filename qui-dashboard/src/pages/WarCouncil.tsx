import { motion } from "framer-motion";
import { ShieldAlert, Zap, Terminal, AlertTriangle, Activity, Lock, Key, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { socket } from "../api/socket";

interface WarCouncilProps {
  logs: any[];
}

interface ImperialEvent {
  id: string;
  sourceProjectId?: string;
  source?: string;
  eventType?: string;
  type?: string;
  payload: any;
  targetProjectId?: string;
  targetType?: string;
  createdAt?: string;
  timestamp?: string;
}

function ImperialSealPanel({ logs }: { logs: any[] }) {
  const sealedCount = logs.filter(l => l.metadata?.signature).length;
  
  return (
    <div className="imperial-panel p-8 flex flex-col gap-6 w-full lg:w-1/3 shrink-0">
      <div className="flex items-center gap-3 border-b border-primary/10 pb-6 shrink-0">
        <Lock className="w-5 h-5 text-accent" />
        <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-accent">
          Imperial Seal
        </h2>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <div className="p-6 rounded-xl border border-accent/20 bg-accent/5 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full border-4 border-accent border-dashed flex items-center justify-center animate-[spin_10s_linear_infinite]">
            <Key className="w-6 h-6 text-accent animate-none" />
          </div>
          <div className="text-xs font-cinzel tracking-widest text-accent text-center mt-2">
            ROOT SEAL VERIFIED
          </div>
          <div className="text-[9px] uppercase opacity-40 text-center px-4">
            All mandates require sovereign RSA-2048 cryptographic verification.
          </div>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-black/20 border border-primary/10 text-center">
             <div className="text-[10px] uppercase opacity-30 tracking-widest mb-1">Sealed</div>
             <div className="text-xl font-cinzel text-accent">{sealedCount}</div>
          </div>
          <div className="p-4 rounded-xl bg-black/20 border border-primary/10 text-center">
             <div className="text-[10px] uppercase opacity-30 tracking-widest mb-1">Status</div>
             <div className="text-[14px] font-bold text-green-500 mt-1">SECURE</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventBusPanel() {
  const [events, setEvents] = useState<ImperialEvent[]>([]);

  useEffect(() => {
    api.get("/communication/bus?limit=20").then(res => setEvents(res.data)).catch(() => {});
    
    const handleEvent = (data: any) => {
      setEvents(prev => [{ ...data, createdAt: data.timestamp }, ...prev].slice(0, 20));
    };
    
    socket.on("imperial_event", handleEvent);
    return () => { socket.off("imperial_event", handleEvent); };
  }, []);

  return (
    <div className="imperial-panel p-8 flex flex-col w-full lg:w-2/3 shrink-0">
      <div className="flex items-center gap-3 border-b border-primary/10 pb-6 shrink-0 mb-6">
        <Radio className="w-5 h-5 text-primary" />
        <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-primary">
          Imperial Bus (Comms)
        </h2>
        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-green-500/20 bg-green-500/5 text-green-500 ml-auto flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Live Intercept
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {events.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 bg-black/20 border-l-[3px] border-l-primary/40 border-r border-y border-primary/10 rounded-r-xl"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                {e.eventType || e.type}
              </span>
              <span className="text-[8px] font-mono opacity-30 pt-0.5">
                {new Date(e.createdAt || e.timestamp || Date.now()).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-[9px] opacity-60 font-mono break-all line-clamp-2">
               {JSON.stringify(e.payload)}
            </div>
            <div className="text-[8px] uppercase tracking-widest opacity-20 mt-2">
               SRC: {e.sourceProjectId?.substring(0,8) || e.source?.substring(0,8)} 
               {e.targetProjectId && ` → TGT: ${e.targetProjectId.substring(0,8)}`}
            </div>
          </motion.div>
        ))}
        {events.length === 0 && (
          <div className="h-40 flex items-center justify-center border border-dashed border-primary/10 rounded-xl opacity-20 italic text-xs">
            The imperial bus is silent. No signals detected.
          </div>
        )}
      </div>
    </div>
  );
}

export default function WarCouncil({ logs }: WarCouncilProps) {
  const criticalAlerts = logs.filter(
    (l) => l.level === "critical" || l.action === "SHADOW_INTRUSION_DETECTED"
  );
  const warningAlerts = logs.filter((l) => l.level === "warning");
  const threatLevel = criticalAlerts.length > 5 ? "ELEVATED" : criticalAlerts.length > 0 ? "GUARDED" : "CONTROLLED";
  const threatColor = criticalAlerts.length > 5
    ? "text-red-500"
    : criticalAlerts.length > 0
    ? "text-yellow-500"
    : "text-green-500";

  const indicators = [
    {
      label: "Critical Alerts",
      value: criticalAlerts.length,
      icon: ShieldAlert,
      color: "text-red-500",
    },
    {
      label: "Warning Signals",
      value: warningAlerts.length,
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      label: "Total Events",
      value: logs.length,
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "Threat Level",
      value: threatLevel,
      icon: AlertTriangle,
      color: threatColor,
    },
  ];

  return (
    <div className="flex flex-col h-full gap-8 overflow-y-auto pr-4 scrollbar-thin">

      {/* Battle Indicators — all values from real audit log data */}
      <div className="grid grid-cols-4 gap-6 shrink-0 pt-2">
        {indicators.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="imperial-panel p-8 group hover:bg-red-500/5 transition-all duration-500 relative overflow-hidden"
          >
            {t.label === "Threat Level" && (
              <div
                className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl -mr-16 -mt-16
                  ${criticalAlerts.length > 5 ? "bg-red-500" : criticalAlerts.length > 0 ? "bg-yellow-500" : "bg-green-500"}`}
              />
            )}
            <div className={`p-4 rounded-xl border border-primary/20 mb-4 inline-block ${t.color}`}>
              <t.icon className="w-5 h-5" />
            </div>
            <h4 className="text-[9px] uppercase tracking-[3px] opacity-40 group-hover:opacity-80 transition-opacity whitespace-nowrap">
              {t.label}
            </h4>
            <div className={`text-2xl font-cinzel font-bold tracking-widest ${t.color} truncate`}>
              {t.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 shrink-0">
        <ImperialSealPanel logs={logs} />
        <EventBusPanel />
      </div>

      {/* Battle Records — real critical audit events only */}
      <div className="imperial-panel flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6 shrink-0">
          <div>
            <h2 className="text-xl font-cinzel tracking-[4px] uppercase font-bold text-red-500 mb-1">
              Battle Records
            </h2>
            <p className="text-[10px] uppercase opacity-40">
              Critical alerts and shadow intrusion events from the audit registry
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {criticalAlerts.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="p-5 bg-black/40 border-l-4 border-l-red-500 border-r border-y border-red-500/10 rounded-r-xl flex items-center gap-6 group hover:translate-x-2 transition-transform duration-500"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                    {a.action}
                  </span>
                  <span className="text-[9px] font-mono opacity-20 uppercase">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-[11px] text-white/70 overflow-hidden text-ellipsis whitespace-nowrap w-2/3">
                  {a.ipAddress ? (
                    <>
                      Origin:{" "}
                      <span className="text-accent">{a.ipAddress}</span> —{" "}
                    </>
                  ) : null}
                  {a.metadata?.projectName || a.metadata?.message || "System security event logged"}
                </p>
              </div>
              <div className="bg-red-500/20 text-red-400 text-[8px] px-3 py-1 rounded font-bold uppercase tracking-widest">
                {a.level}
              </div>
            </motion.div>
          ))}
          {criticalAlerts.length === 0 && (
            <div className="h-40 flex items-center justify-center border border-dashed border-red-500/10 rounded-xl text-red-500/40 text-xs italic">
              No critical threat signals detected in the current cycle.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
