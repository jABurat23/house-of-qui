import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Crown, 
  ShieldAlert, 
  Database, 
  Wallet, 
  LogOut, 
  Cpu, 
  ScrollText,
  Hammer,
  Settings,
  X,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Monitor,
  Terminal
} from "lucide-react";
import { useState, useEffect } from "react";

interface CourtLayoutProps {
  children: ReactNode;
  onLogout: () => void;
  session: any;
  logs?: any[];
}

export default function CourtLayout({ 
  children, 
  onLogout, 
  session,
  logs = [] 
}: CourtLayoutProps) {
  
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split("/").pop() || "overview";

  const sectors = [
    { id: "overview", label: "Throne Chamber", icon: Crown, desc: "Sovereign Control", path: "/overview" },
    { id: "command", label: "Command Center", icon: Terminal, desc: "Remote Operations", path: "/command" },
    { id: "security", label: "War Council", icon: ShieldAlert, desc: "Threat Signals", path: "/security" },
    { id: "archives", label: "Grand Archives", icon: Database, desc: "Recorded Events & Commands", path: "/archives" },
    { id: "treasury", label: "Treasury", icon: Wallet, desc: "Imperial Reserves", path: "/treasury" },
    { id: "forge", label: "The Forge", icon: Hammer, desc: "System Constructs & Logistics", path: "/forge" },
  ];

  const [isChronicleOpen, setIsChronicleOpen] = useState(false); // Default to closed for breathing room
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light" | "system">(() => {
    return (localStorage.getItem("imperial_theme") as any) || "system";
  });

  useEffect(() => {
     let actualTheme = theme;
     if (theme === "system") {
        actualTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
     }
     localStorage.setItem("imperial_theme", theme);
     if (actualTheme === "light") {
        document.documentElement.classList.add("light-theme");
     } else {
        document.documentElement.classList.remove("light-theme");
     }
  }, [theme]);

  const sidebarWidth = isSidebarCollapsed ? "w-24" : "w-72";

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-inter text-white/80 select-none">
      
      {/* 🧭 Left Column: Court Navigation */}
      <aside className={`${sidebarWidth} transition-all duration-500 bg-black/40 border-r border-primary/10 flex flex-col backdrop-blur-md relative z-30`}>
        <div className={`p-8 border-b border-primary/10 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-background p-[1px] shrink-0">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center shadow-imperial-gold shadow-lg">
                  <span className="text-primary font-cinzel text-xl font-bold">Q</span>
                </div>
              </div>
            </div>
            {!isSidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-cinzel text-xl tracking-widest text-primary leading-tight">HOUSE OF QUI</h1>
                <p className="text-[9px] uppercase tracking-[2px] opacity-40">Sovereign OS v1.0</p>
              </motion.div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto custom-scroll">
          {sectors.map((s) => (
            <Link
              key={s.id}
              to={s.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-500 group relative
                ${activeTab === s.id ? 'bg-primary/10 text-primary shadow-imperial-gold shadow-sm' : 'hover:bg-primary/5 text-white/40 hover:text-white/80'}
                ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              title={isSidebarCollapsed ? s.label : ""}
            >
              {activeTab === s.id && (
                <motion.div 
                  layoutId="nav-active" 
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" 
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <s.icon className={`w-5 h-5 shrink-0 ${activeTab === s.id ? 'text-primary' : 'text-white/20 group-hover:text-primary transition-colors duration-500'}`} />
              {!isSidebarCollapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-left">
                  <div className="font-cinzel text-xs tracking-[1px] font-bold whitespace-nowrap">{s.label}</div>
                  <div className="text-[10px] opacity-40 group-hover:opacity-60 transition-opacity whitespace-nowrap">{s.desc}</div>
                </motion.div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-primary/10 bg-black/20">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`w-full flex items-center gap-3 mb-4 text-left hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all
              ${isSidebarCollapsed ? 'justify-center p-0' : ''}`}
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shadow-neon-cyan shrink-0">
              <span className="text-accent text-[10px] uppercase font-bold">{session?.role?.[0] || 'O'}</span>
            </div>
            {!isSidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-hidden">
                <div className="text-xs font-bold text-accent truncate uppercase tracking-wider">{session?.imperialName || "GUEST"}</div>
                <div className="text-[9px] opacity-40 truncate">Clearance: {session?.clearanceLevel || 1}</div>
              </motion.div>
            )}
            {!isSidebarCollapsed && <Settings className="w-4 h-4 text-primary/40 shrink-0" />}
          </button>
          
          <button 
            onClick={onLogout}
            className={`w-full imperial-btn flex items-center justify-center gap-2 py-2 hover:bg-crimson/20 hover:text-red-400 hover:border-red-600/50 
              ${isSidebarCollapsed ? 'p-0 px-2' : ''}`}
          >
            <LogOut className="w-3 h-3" />
            {!isSidebarCollapsed && <span className="text-[10px]">Logout</span>}
          </button>
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="mt-6 w-full flex items-center justify-center text-primary/20 hover:text-primary transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* 🏛️ Center: Active Chamber */}
      <main className="relative flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden">
        
        {/* Top Header / Breadcrumb */}
        <header className="h-20 border-b border-primary/5 flex items-center px-10 gap-4 bg-black/10 backdrop-blur-sm z-10 shrink-0">
          <ScrollText className="w-4 h-4 text-primary/40" />
          <div className="hidden sm:block text-xs uppercase tracking-[3px] font-cinzel text-primary/60 truncate">
             Court Chamber // <span className="text-primary font-bold">{sectors.find(s => s.id === activeTab)?.label}</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] opacity-40 hover:opacity-100 transition-opacity cursor-default uppercase tracking-widest whitespace-nowrap">
               <Cpu className="w-3 h-3 animate-pulse text-accent" />
               Pulse Stable
             </div>
             <div className="h-4 w-[1px] bg-primary/10 hidden md:block" />
             <div className="text-[10px] text-primary font-cinzel hidden md:block">Cycle: {new Date().toLocaleDateString('en-CA').replace(/-/g, '.')}</div>
             <button 
               onClick={() => setIsChronicleOpen(!isChronicleOpen)} 
               className={`p-2.5 border border-primary/20 rounded-xl transition-all flex items-center gap-2 group
                 ${isChronicleOpen ? 'bg-primary text-black border-primary' : 'bg-black/40 text-primary/40 hover:border-primary/60 hover:text-primary'}`}
               title="Toggle Imperial Chronicle"
             >
               <ScrollText className="w-4 h-4" />
               <span className="text-[10px] uppercase font-bold tracking-widest hidden lg:block">Chronicle</span>
               {isChronicleOpen ? <X className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
             </button>
          </div>
        </header>

        {/* Content Area with ceremonial fade/slide transition */}
        <div className="flex-1 overflow-hidden relative bg-transparent">
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
              className="absolute inset-0 p-6 md:p-12 overflow-y-auto custom-scroll flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 🧿 Right: Whisper Panel (Logs) - Overlayed for better breathability */}
      <AnimatePresence>
        {isChronicleOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChronicleOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside 
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[400px] max-w-[90vw] whisper-panel z-50 flex flex-col shadow-2xl border-l border-primary/20 bg-black/80 backdrop-blur-2xl"
            >
              <div className="p-8 border-b border-primary/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ScrollText className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-cinzel text-sm tracking-widest text-primary font-bold uppercase">Imperial Chronicle</h3>
                </div>
                <button 
                  onClick={() => setIsChronicleOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 opacity-40 hover:opacity-100" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scroll flex flex-col gap-6">
                <div className="text-[10px] uppercase tracking-[4px] opacity-20 mb-2 font-bold">Recent Signals</div>
                {logs.length > 0 ? (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex flex-col gap-2 border-l-2 border-primary/10 pl-6 py-2 hover:border-accent/40 transition-all group relative"
                    >
                      <div className="absolute left-[-2px] top-0 bottom-0 w-0.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity shadow-neon-cyan shadow-sm" />
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] uppercase tracking-widest font-bold font-cinzel
                          ${log.level === 'critical' ? 'text-red-400' : 'text-primary/80'}`}>
                          {log.action}
                        </span>
                        <span className="text-[9px] opacity-30 group-hover:opacity-100 tabular-nums transition-opacity">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-60 group-hover:opacity-100 flex-1 break-words font-light">
                         {log.message || log.metadata?.projectName || 'System entry documented'}
                      </p>
                    </motion.div>
                  ))
                ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 text-[10px] uppercase italic text-center gap-4">
                      <div className="w-12 h-12 border border-primary/10 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 animate-pulse" />
                      </div>
                      Waiting for the whisper of events...
                   </div>
                )}
              </div>
              <div className="p-8 border-t border-primary/10 bg-black/20 shrink-0">
                  <div className="text-[9px] uppercase tracking-[4px] opacity-20 text-center font-bold">
                     End of Records
                  </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ⚙️ OVERLAYS: Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="imperial-panel p-10 w-full max-w-lg flex flex-col gap-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              
              <div className="flex items-center justify-between border-b border-primary/10 pb-6 relative z-10">
                 <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-primary" />
                    <h2 className="font-cinzel text-xl tracking-[4px] uppercase text-primary font-bold">System Preferences</h2>
                 </div>
                 <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5 hover:text-red-400 text-primary/60 transition-colors" />
                 </button>
              </div>

              <div className="space-y-8 relative z-10">
                 <div>
                    <label className="text-[10px] uppercase tracking-[4px] opacity-40 block mb-4 font-bold">Chamber Atmosphere</label>
                    <div className="grid grid-cols-3 gap-4">
                       <button onClick={() => setTheme("dark")} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary text-primary bg-primary/10 shadow-imperial-gold' : 'border-primary/10 opacity-40 hover:opacity-100 hover:border-primary/30 bg-black/20'}`}>
                          <Moon className="w-6 h-6 mb-2" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">Dark</span>
                       </button>
                       <button onClick={() => setTheme("light")} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary text-primary bg-primary/10 shadow-imperial-gold' : 'border-primary/10 opacity-40 hover:opacity-100 hover:border-primary/30 bg-black/20'}`}>
                          <Sun className="w-6 h-6 mb-2" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">Light</span>
                       </button>
                       <button onClick={() => setTheme("system")} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary text-primary bg-primary/10 shadow-imperial-gold' : 'border-primary/10 opacity-40 hover:opacity-100 hover:border-primary/30 bg-black/20'}`}>
                          <Monitor className="w-6 h-6 mb-2" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">System</span>
                       </button>
                    </div>
                 </div>

                 <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                    <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">User Credentials</h4>
                    <div className="text-xs opacity-60 flex flex-col gap-1">
                       <div className="flex justify-between">
                          <span>Identity:</span>
                          <span className="text-white">{session?.imperialName}</span>
                       </div>
                       <div className="flex justify-between">
                          <span>Clearance:</span>
                          <span className="text-white">Level {session?.clearanceLevel}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-4 border-t border-primary/10 pt-8 flex gap-4">
                 <button onClick={() => setIsSettingsOpen(false)} className="flex-1 imperial-btn opacity-60 hover:opacity-100">
                    Keep Active
                 </button>
                 <button onClick={() => { setIsSettingsOpen(false); onLogout(); }} className="flex-1 imperial-btn border-red-900/40 text-red-500 hover:bg-crimson/20 hover:border-red-600/50">
                    Refuge
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

