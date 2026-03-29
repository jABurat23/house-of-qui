import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Rocket, Package, Settings, ChevronDown,
  ChevronUp, BookOpen, Tag, ToggleLeft, ToggleRight,
  Check, X, Loader
} from "lucide-react";
import { api } from "../api/client";
import { socket } from "../api/socket";
import type { Project } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Deployment {
  id: string;
  version: string;
  status: "deploying" | "success" | "failed" | "rolling_back";
  logs?: string;
  createdAt: string;
}

interface SysConfig {
  id: string;
  key: string;
  value: any;
  type: string;
  category?: string;
  description?: string;
}

interface Pkg {
  id: string;
  namespace: string;
  name: string;
  version: string;
  description?: string;
  stability?: string;
  downloads?: number;
  author?: string;
}

interface ResourceUsage {
  projectId: string;
  name: string;
  usage: {
    memory: number;
    cpu: number;
    storage: number;
  };
  limits: {
    memory: number;
    cpu: number;
    storage: number;
  };
  timestamp: string;
}

// ─── Sub-Panels ────────────────────────────────────────────────────────────

function DeploymentPanel({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [deploying, setDeploying] = useState(false);
  const [version, setVersion] = useState("latest");
  const [loadingDeployments, setLoadingDeployments] = useState(false);

  const loadDeployments = async (project: Project) => {
    setSelectedProject(project);
    setLoadingDeployments(true);
    try {
      const res = await api.get(`/monarch/projects/${project.id}/deployments`);
      setDeployments(res.data);
    } catch {
      setDeployments([]);
    } finally {
      setLoadingDeployments(false);
    }
  };

  const triggerDeploy = async () => {
    if (!selectedProject) return;
    setDeploying(true);
    try {
      await api.post(`/monarch/projects/${selectedProject.id}/deploy`, { version });
      await loadDeployments(selectedProject);
    } catch (err) {
      console.error("Deployment command failed.", err);
    } finally {
      setDeploying(false);
    }
  };

  const statusColor = (s: string) => {
    if (s === "success") return "text-green-400";
    if (s === "failed") return "text-red-400";
    if (s === "deploying" || s === "rolling_back") return "text-yellow-400";
    return "text-primary/60";
  };

  const statusIcon = (s: string) => {
    if (s === "success") return <Check className="w-3 h-3" />;
    if (s === "failed") return <X className="w-3 h-3" />;
    return <Loader className="w-3 h-3 animate-spin" />;
  };

  return (
    <div className="imperial-panel p-8 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-primary/10 pb-6">
        <Rocket className="w-5 h-5 text-primary" />
        <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-primary">
          Deployment Registry
        </h2>
      </div>

      {/* Project selector */}
      <div className="grid grid-cols-2 gap-4 max-h-44 overflow-y-auto pr-2 scrollbar-thin">
        {projects.length === 0 && (
          <div className="col-span-2 text-center opacity-20 italic text-xs py-8">
            No projects registered. Deploy requires at least one mandate.
          </div>
        )}
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => loadDeployments(p)}
            className={`text-left p-4 rounded-xl border transition-all duration-300 ${
              selectedProject?.id === p.id
                ? "bg-primary/10 border-primary/50 text-primary"
                : "bg-black/20 border-primary/10 text-white/50 hover:border-primary/30 hover:text-white/80"
            }`}
          >
            <div className="font-cinzel text-xs tracking-widest truncate">{p.name}</div>
            <div className="text-[9px] opacity-40 mt-1 truncate">ID: {p.id.substring(0, 12)}...</div>
          </button>
        ))}
      </div>

      {/* Deploy action */}
      {selectedProject && (
        <div className="flex items-center gap-4 p-4 bg-black/20 border border-primary/10 rounded-xl">
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="version (e.g. 1.0.1)"
            className="flex-1 bg-transparent border border-primary/20 rounded-lg px-4 py-2 text-xs font-mono focus:outline-none focus:border-primary/60 text-white/80 placeholder-white/20"
          />
          <button
            onClick={triggerDeploy}
            disabled={deploying}
            className="imperial-btn text-[10px] py-2 px-6 flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {deploying ? <Loader className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />}
            Dispatch
          </button>
        </div>
      )}

      {/* Deployment history */}
      {selectedProject && (
        <div className="flex flex-col gap-3">
          <div className="text-[9px] uppercase tracking-widest opacity-30 font-bold">
            Deployment Chronicle — {selectedProject.name}
          </div>
          {loadingDeployments && (
            <div className="text-center opacity-20 italic text-xs py-4">Loading chronicles...</div>
          )}
          {!loadingDeployments && deployments.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 bg-black/20 border border-primary/10 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-black/40 ${statusColor(d.status)}`}>
                  {statusIcon(d.status)}
                </div>
                <div>
                  <div className="text-xs font-cinzel text-primary/80 tracking-widest">v{d.version}</div>
                  <div className="text-[9px] opacity-30 font-mono">{new Date(d.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/40 ${statusColor(d.status)}`}>
                {d.status}
              </span>
            </motion.div>
          ))}
          {!loadingDeployments && deployments.length === 0 && (
            <div className="text-center opacity-20 italic text-xs py-4 border border-dashed border-primary/10 rounded-xl">
              No deployments recorded for this mandate.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PackageRegistryPanel() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/packages")
      .then((r) => setPackages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = packages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.namespace.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const stabilityColor = (s?: string) => {
    if (s === "stable") return "text-green-400 border-green-400/20 bg-green-400/5";
    if (s === "beta") return "text-yellow-400 border-yellow-400/20 bg-yellow-400/5";
    return "text-red-400 border-red-400/20 bg-red-400/5";
  };

  return (
    <div className="imperial-panel p-8 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-primary/10 pb-6">
        <Package className="w-5 h-5 text-primary" />
        <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-primary">
          House Package Registry
        </h2>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search packages..."
        className="w-full bg-transparent border border-primary/20 rounded-lg px-4 py-2 text-xs font-mono focus:outline-none focus:border-primary/60 text-white/80 placeholder-white/20"
      />

      {loading && <div className="text-center opacity-20 italic text-xs py-4">Consulting the registry...</div>}

      <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
        {filtered.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 bg-black/20 border border-primary/10 rounded-xl flex items-center justify-between group hover:bg-accent/5 hover:border-accent/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-black/40 border border-primary/10 text-primary group-hover:text-accent transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-cinzel text-primary group-hover:text-accent tracking-widest">
                    @{pkg.namespace}/{pkg.name}
                  </span>
                  <span className="text-[9px] font-mono opacity-30">v{pkg.version}</span>
                </div>
                <div className="text-[9px] opacity-40 mt-0.5 truncate max-w-sm">
                  {pkg.description || "Imperial module"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {pkg.downloads !== undefined && (
                <div className="text-right">
                  <div className="text-[8px] opacity-30 uppercase">Downloads</div>
                  <div className="text-[10px] font-mono text-primary/60">{pkg.downloads}</div>
                </div>
              )}
              <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${stabilityColor(pkg.stability)}`}>
                {pkg.stability || "exp"}
              </span>
            </div>
          </motion.div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="text-center opacity-20 italic text-xs py-8 border border-dashed border-primary/10 rounded-xl">
            No packages found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

function SystemMandatePanel() {
  const [configs, setConfigs] = useState<SysConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get("/system/config")
      .then((r) => setConfigs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateConfig = async (key: string, value: any) => {
    setSaving(key);
    try {
      await api.post("/system/config", { key, value });
      setConfigs((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
    } catch (err) {
      console.error("Mandate update failed.", err);
    } finally {
      setSaving(null);
    }
  };

  const grouped = configs.reduce<Record<string, SysConfig[]>>((acc, c) => {
    const cat = c.category || "general";
    acc[cat] = acc[cat] || [];
    acc[cat].push(c);
    return acc;
  }, {});

  return (
    <div className="imperial-panel p-8 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-primary/10 pb-6">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-primary">
          Imperial Mandates
        </h2>
        <span className="text-[9px] opacity-30 ml-auto uppercase tracking-widest">System Configuration</span>
      </div>

      {loading && <div className="text-center opacity-20 italic text-xs py-4">Consulting the mandates...</div>}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <button
            className="w-full flex items-center justify-between mb-3 text-[9px] uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity"
            onClick={() => setExpanded(expanded === category ? null : category)}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-3 h-3" />
              {category}
            </div>
            {expanded === category ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <AnimatePresence>
            {(expanded === category || expanded === null) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2 overflow-hidden"
              >
                {items.map((cfg) => (
                  <div
                    key={cfg.id}
                    className="flex items-center justify-between p-4 bg-black/20 border border-primary/10 rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-mono text-primary/80 tracking-wider">{cfg.key}</div>
                      {cfg.description && (
                        <div className="text-[9px] opacity-30 mt-0.5">{cfg.description}</div>
                      )}
                    </div>
                    <div className="shrink-0 ml-4">
                      {cfg.type === "boolean" ? (
                        <button
                          onClick={() => updateConfig(cfg.key, !cfg.value)}
                          className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            cfg.value ? "text-accent" : "text-white/20"
                          }`}
                        >
                          {saving === cfg.key ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : cfg.value ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                          {cfg.value ? "ON" : "OFF"}
                        </button>
                      ) : (
                        <input
                          type={cfg.type === "number" ? "number" : "text"}
                          defaultValue={cfg.value}
                          onBlur={(e) => updateConfig(cfg.key, cfg.type === "number" ? Number(e.target.value) : e.target.value)}
                          className="bg-transparent border border-primary/20 rounded-lg px-3 py-1 text-[10px] font-mono text-right w-28 focus:outline-none focus:border-primary/60"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {!loading && configs.length === 0 && (
        <div className="text-center opacity-20 italic text-xs py-8 border border-dashed border-primary/10 rounded-xl">
          No mandates configured. The system awaits its edicts.
        </div>
      )}
    </div>
  );
}

function ResourceBar({ label, used, limit, unit, bgClass }: { label: string, used: number, limit: number, unit: string, bgClass: string }) {
  const percent = limit > 0 ? Math.min(100, Math.floor((used / limit) * 100)) : 0;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-60 mb-1">
        <span>{label}</span>
        <span>{used}{unit} / {limit}{unit} ({percent}%)</span>
      </div>
      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
        <div className={`h-full ${bgClass} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ResourceUsagePanel() {
  const [usages, setUsages] = useState<Record<string, ResourceUsage>>({});
  
  useEffect(() => {
    const handleUsage = (data: ResourceUsage) => {
      setUsages(prev => ({ ...prev, [data.projectId]: data }));
    };
    socket.on("resource_usage", handleUsage);
    return () => { socket.off("resource_usage", handleUsage); };
  }, []);

  const usageList = Object.values(usages);

  if (usageList.length === 0) return null;

  return (
    <div className="imperial-panel p-8 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-primary/10 pb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-primary">
          Logistics Tracking (Fleet Status)
        </h2>
        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-green-500/20 bg-green-500/5 text-green-500 ml-auto flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Live Telemetry
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {usageList.map(item => (
          <div key={item.projectId} className="p-4 bg-black/20 border border-primary/10 rounded-xl">
            <div className="text-xs font-cinzel text-primary tracking-widest mb-4">
              {item.name}
            </div>
            
            <ResourceBar label="Memory" used={item.usage.memory} limit={item.limits.memory} unit="MB" bgClass="bg-accent/60" />
            <ResourceBar label="CPU" used={item.usage.cpu} limit={item.limits.cpu} unit="m" bgClass="bg-yellow-400/60" />
            <ResourceBar label="Storage" used={item.usage.storage} limit={item.limits.storage} unit="MB" bgClass="bg-green-400/60" />
            
            <div className="text-[8px] opacity-30 text-right mt-2 font-mono">
              Signal: {new Date(item.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Logistics Chamber ────────────────────────────────────────────────

interface LogisticsProps {
  projects: Project[];
}

export default function Logistics({ projects }: LogisticsProps) {
  return (
    <div className="flex flex-col gap-8 overflow-y-auto pr-4 scrollbar-thin">

      {/* Section dividers */}
      <ResourceUsagePanel />
      <DeploymentPanel projects={projects} />
      <PackageRegistryPanel />
      <SystemMandatePanel />

    </div>
  );
}
