import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, Coins } from "lucide-react";
import { api } from "../api/client";

export default function Treasury() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreasury = async () => {
       try {
          const res = await api.get("/monarch/treasury/summary");
          setData(res.data);
       } catch (err) {
          console.error("The Imperial Treasury is silent.", err);
       } finally {
          setLoading(false);
       }
    };
    fetchTreasury();
  }, []);

  if (loading) return (
     <div className="h-full flex items-center justify-center opacity-20 italic">
        Consulting the Imperial Ledger...
     </div>
  );

  const stats = [
    { label: "Total Reserves", value: `Q ${data?.totalBalance?.toFixed(2) || '0.00'}`, icon: Coins, color: "text-primary" },
    { label: "Active Valuations", value: data?.activeValuations || '0', icon: Wallet, color: "text-accent" },
    { label: "Market Volatility", value: "0.02%", icon: TrendingUp, color: "text-primary/60" },
    { label: "Fiscal Cycle", value: "Cycle 47", icon: ArrowUpRight, color: "text-green-500" },
  ];

  return (
    <div className="flex flex-col h-full gap-8 overflow-y-auto pr-4 scrollbar-thin">
      
      {/* 🔮 Treasury Stats: "Fiscal Pulse" */}
      <div className="grid grid-cols-4 gap-6 shrink-0 pt-2">
        {stats.map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="imperial-panel p-8 group hover:bg-white/5 transition-all duration-500"
          >
            <div className={`p-4 rounded-xl border border-primary/10 mb-4 inline-block ${s.color}`}>
                <s.icon className="w-5 h-5 shadow-neon-cyan" />
            </div>
            <h4 className="text-[9px] uppercase tracking-[3px] opacity-40 group-hover:opacity-80 transition-opacity whitespace-nowrap">{s.label}</h4>
            <div className="text-2xl font-cinzel font-bold tracking-widest text-white">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* 🛡️ Ledger: "Imperial Wallets" */}
      <div className="imperial-panel flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6 shrink-0">
           <div>
              <h2 className="text-xl font-cinzel tracking-[4px] uppercase font-bold text-primary mb-1">Imperial Ledger</h2>
              <p className="text-[10px] uppercase opacity-40">Active Project Valuations and Reserved Credits</p>
           </div>
           <button className="imperial-btn text-[10px] py-2 px-6 hover:scale-105 transition-transform duration-500 whitespace-nowrap">Distribute Incentives</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {(data?.wallets || []).map((w: any, i: number) => (
            <motion.div 
              key={w.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.05) }}
              className="p-6 bg-black/20 border border-primary/10 rounded-xl flex items-center justify-between group hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-6">
                 <div className="p-3 rounded-lg bg-black/40 border border-primary/10 text-primary">
                    <Wallet className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-xs font-cinzel tracking-widest text-primary mb-1">{w.project?.name || 'UNKNOWN_MANDATE'}</div>
                    <div className="text-[9px] uppercase opacity-40 tracking-widest">ID: {w.project?.id?.substring(0, 14)}...</div>
                 </div>
              </div>

              <div className="flex items-center gap-12">
                 <div className="text-right">
                    <div className="text-[9px] uppercase opacity-30 pb-1">Consumption Rate</div>
                    <div className="text-xs font-mono text-accent flex items-center gap-2 justify-end">
                       <ArrowDownRight className="w-3 h-3" />
                       0.42 Q/C
                    </div>
                 </div>
                 <div className="text-right min-w-[120px]">
                    <div className="text-[9px] uppercase opacity-30 pb-1">Current Reserves</div>
                    <div className="text-xl font-cinzel text-white tracking-widest">Q {Number(w.balance).toFixed(2)}</div>
                 </div>
              </div>
            </motion.div>
          ))}
          {(data?.wallets || []).length === 0 && (
             <div className="h-40 flex items-center justify-center border border-dashed border-primary/20 rounded-xl text-primary/20 text-xs italic">
                No active ledgers found in the current cycle.
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
