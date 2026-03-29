import { Settings as SettingsIcon, Moon, Sun, Monitor, ShieldAlert, Cpu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Settings() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("system");

  useEffect(() => {
     let actualTheme = theme;
     if (theme === "system") {
        actualTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
     }
     if (actualTheme === "light") {
        document.documentElement.classList.add("light-theme");
     } else {
        document.documentElement.classList.remove("light-theme");
     }
  }, [theme]);

  return (
    <div className="flex flex-col h-full gap-8 overflow-y-auto pr-4 scrollbar-thin">
      <div className="imperial-panel p-10 flex flex-col gap-8 max-w-3xl mx-auto w-full mt-10">
        
        <div className="flex items-center gap-4 border-b border-primary/10 pb-6">
          <SettingsIcon className="w-6 h-6 text-accent" />
          <div>
            <h2 className="font-cinzel text-xl tracking-[4px] uppercase font-bold text-accent">System Settings</h2>
            <p className="text-[10px] uppercase opacity-40 tracking-widest mt-1">Configure your Sovereign interface and preferences</p>
          </div>
        </div>

        <div className="space-y-8">
           {/* Theme Selection */}
           <div className="space-y-4">
             <label className="text-[11px] font-bold uppercase tracking-[3px] text-primary/80 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-primary" /> User Interface Theme
             </label>
             <p className="text-[10px] opacity-40 mb-4 leading-relaxed max-w-lg">
                The House of Qui interface naturally aligns to the dark hues of deep space, but you may override it to a light-optimized mode for different environments.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setTheme("dark")} 
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 group
                  ${theme === 'dark' ? 'border-accent text-accent bg-accent/10 shadow-neon-cyan shadow-sm' : 'border-primary/20 opacity-60 hover:opacity-100 hover:border-primary w-full bg-black/40'}`}
                >
                   <Moon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] uppercase tracking-widest font-bold">Dark Mode</span>
                </button>
                <button 
                  onClick={() => setTheme("light")} 
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 group
                  ${theme === 'light' ? 'border-accent text-accent bg-accent/10 shadow-neon-cyan shadow-sm' : 'border-primary/20 opacity-60 hover:opacity-100 hover:border-primary w-full bg-black/40'}`}
                >
                   <Sun className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] uppercase tracking-widest font-bold">Light Mode</span>
                </button>
                <button 
                  onClick={() => setTheme("system")} 
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 group
                  ${theme === 'system' ? 'border-accent text-accent bg-accent/10 shadow-neon-cyan shadow-sm' : 'border-primary/20 opacity-60 hover:opacity-100 hover:border-primary w-full bg-black/40'}`}
                >
                   <Monitor className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] uppercase tracking-widest font-bold">System Default</span>
                </button>
             </div>
           </div>

           <hr className="border-primary/10" />

           {/* System Information */}
           <div className="space-y-4">
             <label className="text-[11px] font-bold uppercase tracking-[3px] text-primary/80 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" /> Core Information
             </label>
             <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl border border-primary/10 bg-black/20">
                   <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">OS Version</div>
                   <div className="text-sm font-mono text-primary">v1.0.4-SOVEREIGN</div>
                </div>
                <div className="p-4 rounded-xl border border-primary/10 bg-black/20">
                   <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Architecture</div>
                   <div className="text-sm font-mono text-primary">NEST-CORE</div>
                </div>
                <div className="p-4 rounded-xl border border-primary/10 bg-black/20">
                   <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Network Protocol</div>
                   <div className="text-sm font-mono text-primary">WSS / REST (Secured)</div>
                </div>
                <div className="p-4 rounded-xl border border-primary/10 bg-black/20">
                   <div className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Security Fabric</div>
                   <div className="text-sm font-mono text-green-500 font-bold flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3" /> VERIFIED
                   </div>
                </div>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
