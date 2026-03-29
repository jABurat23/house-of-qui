import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hammer, Cpu, Package, ToggleRight } from "lucide-react";
import { api } from "../api/client";
import Logistics from "./Logistics";
import type { Project } from "../types";

export default function Forge({ projects }: { projects: Project[] }) {
  const [activeSubTab, setActiveSubTab] = useState<"plugins" | "logistics">("plugins");
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const res = await api.get("/plugins");
        setPlugins(res.data);
      } catch (err) {
        console.error("The Forge is cold.", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPlugins();
  }, []);

  const togglePlugin = async (id: string, currentlyEnabled: boolean) => {
    try {
      if (currentlyEnabled) {
        await api.post(`/plugins/${id}/disable`);
      } else {
        await api.post(`/plugins/${id}/enable`);
      }
      setPlugins(plugins.map(p => p.id === id ? { ...p, enabled: !currentlyEnabled } : p));
    } catch (err) {
      console.error("Failed to toggle module", err);
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center opacity-20 italic">
      Igniting the Forge...
    </div>
  );

  if (error) return (
    <div className="h-full flex items-center justify-center opacity-20 italic text-red-400">
      The Forge is unreachable. Verify the Imperial Core is active.
    </div>
  );

  const enabledCount = plugins.filter((p) => p.enabled).length;
  const disabledCount = plugins.length - enabledCount;

  const stats = [
    {
      label: "Total Constructs",
      value: plugins.length,
      icon: Cpu,
    },
    {
      label: "Stable",
      value: enabledCount,
      icon: Hammer,
      color: "text-green-500",
    },
    {
      label: "Dormant",
      value: disabledCount,
      icon: Package,
      color: "text-primary/40",
    },
    {
      label: "Forge Status",
      value: plugins.length > 0 ? "OPERATIONAL" : "IDLE",
      icon: ToggleRight,
      color: plugins.length > 0 ? "text-accent" : "text-primary/40",
    },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Sub-Navigation */}
      <div className="flex gap-2 border-b border-primary/10 pb-4 shrink-0 overflow-x-auto scrollbar-none">
        <button 
          onClick={() => setActiveSubTab("plugins")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all ${
            activeSubTab === "plugins" ? "bg-primary/20 text-primary border border-primary/40 shadow-imperial-gold" : "bg-black/20 text-primary/40 border border-primary/10 hover:border-primary/20 hover:text-primary/60"
          }`}
        >
          <Hammer className="w-4 h-4" />
          System Constructs
        </button>
        <button 
          onClick={() => setActiveSubTab("logistics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all ${
            activeSubTab === "logistics" ? "bg-accent/20 text-accent border border-accent/40 shadow-neon-cyan" : "bg-black/20 text-primary/40 border border-primary/10 hover:border-primary/20 hover:text-primary/60"
          }`}
        >
          <Package className="w-4 h-4" />
          Logistics & Deployments
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeSubTab === "plugins" && (
            <motion.div 
              key="plugins"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="h-full absolute inset-0 flex flex-col gap-8 overflow-y-auto pr-4 scrollbar-thin"
            >
              {/* Subsystem Pulse — all values derived from real plugin registry */}
              <div className="grid grid-cols-4 gap-6 shrink-0 pt-2">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="imperial-panel p-8 group hover:bg-white/5 transition-all duration-500"
          >
            <div className={`p-4 rounded-xl border border-primary/10 mb-4 inline-block ${s.color || "text-primary"} group-hover:text-accent transition-colors`}>
              <s.icon className="w-5 h-5" />
            </div>
            <h4 className="text-[9px] uppercase tracking-[3px] opacity-40 group-hover:opacity-80 transition-opacity whitespace-nowrap">
              {s.label}
            </h4>
            <div className="text-2xl font-cinzel font-bold tracking-widest text-white">
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Imperial Artifacts */}
      <div className="imperial-panel flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6 shrink-0">
          <div>
            <h2 className="text-xl font-cinzel tracking-[4px] uppercase font-bold text-primary mb-1">
              Imperial Artifacts
            </h2>
            <p className="text-[10px] uppercase opacity-40">
              System-level constructs and registered protocol modules
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {plugins.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="p-6 bg-black/20 border border-primary/10 rounded-xl flex items-center justify-between group hover:bg-accent/5 hover:border-accent/30 transition-all duration-500"
            >
              <div className="flex items-center gap-6">
                <div className="p-3 rounded-lg bg-black/40 border border-primary/10 text-primary group-hover:text-accent transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-cinzel tracking-widest text-primary mb-1 group-hover:text-accent">
                    {p.name}{" "}
                    <span className="text-[9px] opacity-30 font-mono italic">v{p.version}</span>
                  </div>
                  <div className="text-[10px] opacity-50 tracking-widest uppercase truncate max-w-sm">
                    {p.description || "System Protocol Module"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-[9px] uppercase opacity-30 pb-1">Status</div>
                  <button
                    onClick={() => togglePlugin(p.id, p.enabled)}
                    className={`text-[10px] font-bold tracking-widest flex items-center gap-2 justify-end px-3 py-1.5 rounded-lg border transition-all ${
                      p.enabled 
                        ? "text-accent border-accent/20 bg-accent/5 hover:bg-accent/10" 
                        : "text-white/40 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        p.enabled ? "bg-accent animate-pulse" : "bg-white/40"
                      }`}
                    />
                    {p.enabled ? "STABLE" : "DORMANT"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {plugins.length === 0 && (
            <div className="h-40 flex items-center justify-center border border-dashed border-primary/20 rounded-xl text-primary/20 text-xs italic">
              No constructs registered in the current cycle.
            </div>
          )}
        </div>
      </div>
            </motion.div>
          )}

          {activeSubTab === "logistics" && (
            <motion.div 
              key="logistics"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="h-full absolute inset-0 overflow-y-auto pr-4 scrollbar-thin"
            >
              <Logistics projects={projects} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
