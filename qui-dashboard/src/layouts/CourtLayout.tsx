import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, 
  ShieldAlert, 
  Database, 
  Wallet, 
  Hammer, 
  LogOut, 
  Cpu, 
  ScrollText 
} from "lucide-react";

interface CourtLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  session: any;
  logs?: any[];
}

export default function CourtLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  session,
  logs = [] 
}: CourtLayoutProps) {
  
  const sectors = [
    { id: "overview", label: "Throne Chamber", icon: Crown, desc: "Sovereign Control" },
    { id: "security", label: "War Council", icon: ShieldAlert, desc: "Threat Signals" },
    { id: "archives", label: "Grand Archives", icon: Database, desc: "Recorded Events" },
    { id: "treasury", label: "Treasury", icon: Wallet, desc: "Imperial Reserves" },
    { id: "forge", label: "The Forge", icon: Hammer, desc: "System Constructs" },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-inter text-white/80 select-none">
      
      {/* 🧭 Left Column: Court Navigation */}
      <aside className="w-72 bg-black/40 border-r border-primary/10 flex flex-col backdrop-blur-md">
        <div className="p-8 border-b border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-background p-[1px]">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center shadow-imperial-gold shadow-lg">
                  <span className="text-primary font-cinzel text-xl font-bold">Q</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="font-cinzel text-xl tracking-widest text-primary leading-tight">HOUSE OF QUI</h1>
              <p className="text-[9px] uppercase tracking-[2px] opacity-40">Sovereign OS v1.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          {sectors.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-500 group relative
                ${activeTab === s.id ? 'bg-primary/10 text-primary shadow-imperial-gold shadow-sm' : 'hover:bg-primary/5 text-white/40 hover:text-white/80'}`}
            >
              {activeTab === s.id && (
                <motion.div 
                  layoutId="nav-active" 
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" 
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <s.icon className={`w-5 h-5 ${activeTab === s.id ? 'text-primary' : 'text-white/20 group-hover:text-primary transition-colors duration-500'}`} />
              <div className="text-left">
                <div className="font-cinzel text-xs tracking-[1px] font-bold">{s.label}</div>
                <div className="text-[10px] opacity-40 group-hover:opacity-60 transition-opacity">{s.desc}</div>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-primary/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shadow-neon-cyan">
              <span className="text-accent text-[10px] uppercase font-bold">{session?.role?.[0] || 'O'}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-accent truncate uppercase tracking-wider">{session?.imperialName}</div>
              <div className="text-[9px] opacity-40 truncate">Clearance: {session?.clearanceLevel || 1}</div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full imperial-btn flex items-center justify-center gap-2 py-2 hover:bg-crimson/20 hover:text-red-400 hover:border-red-600/50"
          >
            <LogOut className="w-3 h-3" />
            <span className="text-[10px]">Retreat from Throne</span>
          </button>
        </div>
      </aside>

      {/* 🏛️ Center: Active Chamber */}
      <main className="relative flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden">
        
        {/* Top Header / Breadcrumb */}
        <header className="h-20 border-b border-primary/5 flex items-center px-10 gap-4 bg-black/10 backdrop-blur-sm z-10 shrink-0">
          <ScrollText className="w-4 h-4 text-primary/40" />
          <div className="text-xs uppercase tracking-[3px] font-cinzel text-primary/60 truncate">
             Court Chamber // {sectors.find(s => s.id === activeTab)?.label}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] opacity-40 hover:opacity-100 transition-opacity cursor-default uppercase tracking-widest">
               <Cpu className="w-3 h-3 animate-pulse text-accent" />
               Pulse Stable
             </div>
             <div className="h-4 w-[1px] bg-primary/10" />
             <div className="text-[10px] text-primary font-cinzel">Current Cycle: {new Date().toLocaleDateString('en-CA').replace(/-/g, '.')}</div>
          </div>
        </header>

        {/* Content Area with ceremonial fade/slide transition */}
        <div className="flex-1 overflow-y-auto p-10 custom-scroll relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.99, translateY: 15 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              exit={{ opacity: 0, scale: 1.01, translateY: -15 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 🧿 Right: Whisper Panel (Logs) */}
      <aside className="w-80 whisper-panel shrink-0 flex flex-col">
        <div className="p-6 border-b border-primary/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-primary" />
            <h3 className="font-cinzel text-xs tracking-widest text-primary/80">Imperial Chronicle</h3>
          </div>
          <span className="text-[10px] uppercase opacity-30 mt-1">Live Feed</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scrollbar-none flex flex-col gap-4">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-1 border-l-2 border-primary/10 pl-4 py-1 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] uppercase tracking-wider font-bold 
                    ${log.level === 'critical' ? 'text-red-400' : 'text-primary/60'}`}>
                    {log.action}
                  </span>
                  <span className="text-[8px] opacity-20 group-hover:opacity-60 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed opacity-60 group-hover:opacity-100 flex-1">
                   {log.message || log.metadata?.projectName || 'System entry documented'}
                </p>
              </motion.div>
            ))
          ) : (
             <div className="h-full flex items-center justify-center opacity-20 text-[10px] uppercase italic text-center">
                Waiting for the whisper of events...
             </div>
          )}
        </div>
        <div className="p-6 border-t border-primary/10 shrink-0">
            <div className="text-[8px] uppercase tracking-widest opacity-20 text-center">
               End of Visible Records
            </div>
        </div>
      </aside>

    </div>
  );
}
