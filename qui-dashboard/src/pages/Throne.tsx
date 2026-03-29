import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap, Activity, ShieldCheck, Box,
  Cpu, HardDrive, Clock, MemoryStick,
  AlertTriangle, Radio
} from "lucide-react";
import { api } from "../api/client";
import { socket } from "../api/socket";
import type { Project, AuditLog } from "../types";

interface ThroneProps {
  projects: Project[];
  logs: AuditLog[];
}

interface SystemMetrics {
  systemTotal?: number;
  systemUsed?: number;
  heapUsed?: number;
  heapTotal?: number;
  loadAvg?: number[];
  uptime?: number;
  rss?: number;
}

export default function Throne({ projects, logs }: ThroneProps) {
  const [sysMetrics, setSysMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<AuditLog[]>([]);

  // Fetch system metrics every 5 seconds (Phase K)
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get("/monarch/projects/system");
        setSysMetrics(res.data);
      } catch {
        // Metrics unavailable until MetricsPlugin is enabled
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  // Drive watchtower alerts from live audit logs (Phase W)
  useEffect(() => {
    const criticals = logs.filter(
      (l) => l.level === "critical" || l.level === "warning"
    ).slice(0, 5);
    setAlerts(criticals);
  }, [logs]);

  // Real-time alert push from socket (Phase W)
  useEffect(() => {
    socket.on("security_alert", (alert: any) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 5));
    });
    return () => { socket.off("security_alert"); };
  }, []);

  // ── Pulse Monitor stats from real project data ──────────────────────────
  const stats = [
    {
      label: "Active Mandates",
      value: projects.length,
      icon: Box,
      color: "text-primary",
    },
    {
      label: "Security Status",
      value: projects.length > 0 ? "Sovereign" : "Standby",
      icon: ShieldCheck,
      color: projects.length > 0 ? "text-green-500" : "text-primary/40",
    },
    {
      label: "Shadow Projects",
      value: projects.filter((p) => p.isShadow).length,
      icon: Zap,
      color: "text-accent",
    },
    {
      label: "Sealed Mandates",
      value: projects.filter((p) => p.signature).length,
      icon: Activity,
      color: "text-primary/60",
    },
  ];

  // ── System Metrics cards (Phase K) ──────────────────────────────────────
  const memPercent = sysMetrics?.systemTotal
    ? Math.round(((sysMetrics.systemUsed || 0) / sysMetrics.systemTotal) * 100)
    : null;
  const heapPercent = sysMetrics?.heapTotal
    ? Math.round(((sysMetrics.heapUsed || 0) / sysMetrics.heapTotal) * 100)
    : null;
  const loadAvg1m = sysMetrics?.loadAvg?.[0]?.toFixed(2) ?? null;
  const uptimeMins = sysMetrics?.uptime ? Math.floor(sysMetrics.uptime / 60) : null;

  const alertLevelColor = (level: string) => {
    if (level === "critical") return "border-l-red-500 text-red-400";
    if (level === "warning") return "border-l-yellow-500 text-yellow-400";
    return "border-l-primary/30 text-primary/60";
  };

  return (
    <div className="flex flex-col gap-10">

      {/* ── Pulse Monitor (project stats) ─────────────────────────────── */}
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
                <h4 className="text-[10px] uppercase tracking-[3px] opacity-40 group-hover:opacity-80 transition-opacity whitespace-nowrap">
                  {s.label}
                </h4>
                <div className="text-2xl font-cinzel tracking-widest font-bold whitespace-nowrap shrink-0">
                  {s.value}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Imperial Observatory (system metrics) — Phase K ────────────── */}
      <div className="imperial-panel p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-primary/10 pb-4">
          <Cpu className="w-4 h-4 text-accent animate-pulse" />
          <h2 className="font-cinzel text-sm tracking-[3px] uppercase text-primary">
            Imperial Observatory
          </h2>
          <span className="ml-auto text-[9px] uppercase opacity-30 tracking-widest">
            {sysMetrics ? "Live · 5s" : "Awaiting MetricsPlugin"}
          </span>
        </div>

        {sysMetrics ? (
          <div className="grid grid-cols-4 gap-6">
            {/* System RAM */}
            <div className="bg-black/20 border border-primary/10 rounded-xl p-5 group hover:border-green-500/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <HardDrive className="w-4 h-4 text-green-500" />
                <span className="text-[9px] uppercase tracking-widest opacity-40">System RAM</span>
              </div>
              <div className="text-xl font-cinzel text-white mb-2">
                {Math.round((sysMetrics.systemUsed || 0) / 1024 / 1024)} MB
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500/60 rounded-full transition-all duration-500"
                  style={{ width: `${memPercent}%` }}
                />
              </div>
              <div className="text-[8px] opacity-30 mt-1 text-right">{memPercent}%</div>
            </div>
            {/* Node Heap */}
            <div className="bg-black/20 border border-primary/10 rounded-xl p-5 group hover:border-accent/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <MemoryStick className="w-4 h-4 text-accent" />
                <span className="text-[9px] uppercase tracking-widest opacity-40">Node Heap</span>
              </div>
              <div className="text-xl font-cinzel text-white mb-2">
                {Math.round((sysMetrics.heapUsed || 0) / 1024 / 1024)} MB
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent/60 rounded-full transition-all duration-500"
                  style={{ width: `${heapPercent}%` }}
                />
              </div>
              <div className="text-[8px] opacity-30 mt-1 text-right">{heapPercent}%</div>
            </div>
            {/* CPU Load */}
            <div className="bg-black/20 border border-primary/10 rounded-xl p-5 group hover:border-yellow-500/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="w-4 h-4 text-yellow-500" />
                <span className="text-[9px] uppercase tracking-widest opacity-40">CPU Load</span>
              </div>
              <div className="text-xl font-cinzel text-white mb-2">{loadAvg1m}</div>
              <div className="flex gap-1 mt-2">
                {(sysMetrics.loadAvg || []).map((l, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className="text-[8px] opacity-20 mb-1">{["1m", "5m", "15m"][i]}</div>
                    <div className="text-[9px] font-mono opacity-60">{l.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Uptime */}
            <div className="bg-black/20 border border-primary/10 rounded-xl p-5 group hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-[9px] uppercase tracking-widest opacity-40">Uptime</span>
              </div>
              <div className="text-xl font-cinzel text-white mb-2">{uptimeMins}m</div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest text-green-500/60">Operational</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center border border-dashed border-primary/10 rounded-xl opacity-20 italic text-xs">
            MetricsPlugin required. Enable it in The Forge to activate system telemetry.
          </div>
        )}
      </div>

      {/* ── Watchtower Alert Feed (Phase W) ──────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="imperial-panel p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-primary/10 pb-4">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
            <h2 className="font-cinzel text-sm tracking-[3px] uppercase text-red-500">
              Watchtower Alerts
            </h2>
            <span className="ml-auto text-[9px] uppercase opacity-30 tracking-widest">
              Last {alerts.length} Signals
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {alerts.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 bg-black/20 border-l-4 border-r border-y border-white/5 rounded-r-xl ${alertLevelColor(a.level)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest">{a.action}</span>
                  <span className="text-[8px] font-mono opacity-30">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-[9px] opacity-50 mt-1">
                  {a.metadata?.message || a.metadata?.projectName || "System-level alert recorded"}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Dominion Status (projects grid) ──────────────────────────────── */}
      <div className="imperial-panel p-10 flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4 border-b border-primary/10 pb-6 shrink-0">
          <div>
            <h2 className="text-xl font-cinzel tracking-[4px] uppercase font-bold text-primary mb-1">
              Dominion Status
            </h2>
            <p className="text-[10px] uppercase opacity-40">
              Active Project Mandates across House of Qui
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-black/20 border border-primary/10 p-6 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <div className="mb-4 relative z-10">
                <h4 className="font-cinzel text-sm tracking-widest text-primary truncate group-hover:text-white transition-colors">
                  {p.name || "UNNAMED_PROJECT"}
                </h4>
                <p className="text-[9px] uppercase opacity-40 mt-1 truncate">
                  ID: {p.id.substring(0, 18)}...
                </p>
              </div>
              <div className="flex items-center gap-4 relative z-10 bg-black/40 p-3 rounded-lg border border-primary/5">
                <div className="flex-1 shrink-0 whitespace-nowrap">
                  <div className="text-[8px] uppercase opacity-30 pb-1">Signature</div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${p.signature ? "bg-accent animate-pulse" : "bg-red-500"}`} />
                    <span className="text-[10px] uppercase font-bold tracking-widest whitespace-nowrap shrink-0 text-accent">
                      {p.signature ? "Great Seal" : "Unsigned"}
                    </span>
                  </div>
                </div>
                <div className="w-px h-8 bg-primary/10" />
                <div className="flex-1 shrink-0 whitespace-nowrap">
                  <div className="text-[8px] uppercase opacity-30 pb-1">Protocol</div>
                  <div className="text-[10px] font-bold text-white/60 whitespace-nowrap shrink-0">
                    {p.isShadow ? "SHADOW" : "VISIBLE"}
                  </div>
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
