import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowDownRight, Coins, BarChart2 } from "lucide-react";
import { api } from "../api/client";

export default function Treasury() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTreasury = async () => {
      try {
        const res = await api.get("/monarch/treasury/summary");
        setData(res.data);
      } catch (err) {
        console.error("The Imperial Treasury is silent.", err);
        setError(true);
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

  if (error) return (
    <div className="h-full flex items-center justify-center opacity-20 italic text-red-400">
      The Treasury is unreachable. Verify the Imperial Core is active.
    </div>
  );

  const totalBalance = data?.totalBalance ?? 0;
  const wallets: any[] = data?.wallets ?? [];
  const lowestBalance = wallets.length > 0 ? Math.min(...wallets.map((w: any) => Number(w.balance))) : 0;

  const stats = [
    {
      label: "Total Reserves",
      value: `Q ${totalBalance.toFixed(2)}`,
      icon: Coins,
      color: "text-primary",
    },
    {
      label: "Active Wallets",
      value: wallets.length,
      icon: Wallet,
      color: "text-accent",
    },
    {
      label: "Lowest Balance",
      value: `Q ${lowestBalance.toFixed(2)}`,
      icon: ArrowDownRight,
      color: lowestBalance < 50 ? "text-red-500" : "text-primary/60",
    },
    {
      label: "Treasury Health",
      value: totalBalance > 0 ? "SOLVENT" : "EMPTY",
      icon: BarChart2,
      color: totalBalance > 0 ? "text-green-500" : "text-red-500",
    },
  ];

  return (
    <div className="flex flex-col h-full gap-8 overflow-y-auto pr-4 scrollbar-thin">

      {/* Fiscal Pulse — all values derived from real treasury data */}
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
              <s.icon className="w-5 h-5" />
            </div>
            <h4 className="text-[9px] uppercase tracking-[3px] opacity-40 group-hover:opacity-80 transition-opacity whitespace-nowrap">
              {s.label}
            </h4>
            <div className="text-2xl font-cinzel font-bold tracking-widest text-white">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Imperial Ledger */}
      <div className="imperial-panel flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8 border-b border-primary/10 pb-6 shrink-0">
          <div>
            <h2 className="text-xl font-cinzel tracking-[4px] uppercase font-bold text-primary mb-1">
              Imperial Ledger
            </h2>
            <p className="text-[10px] uppercase opacity-40">
              Active project wallets and credit reserves
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {wallets.map((w: any, i: number) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="p-6 bg-black/20 border border-primary/10 rounded-xl flex items-center justify-between group hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="p-3 rounded-lg bg-black/40 border border-primary/10 text-primary">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-cinzel tracking-widest text-primary mb-1">
                    {w.project?.name || "UNKNOWN_MANDATE"}
                  </div>
                  <div className="text-[9px] uppercase opacity-40 tracking-widest">
                    ID: {w.project?.id?.substring(0, 14)}...
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right">
                  <div className="text-[9px] uppercase opacity-30 pb-1">Status</div>
                  <div className={`text-[10px] font-bold flex items-center gap-2 justify-end ${Number(w.balance) > 0 ? "text-accent" : "text-red-400"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${Number(w.balance) > 0 ? "bg-accent" : "bg-red-500"}`} />
                    {Number(w.balance) > 0 ? "FUNDED" : "DEPLETED"}
                  </div>
                </div>
                <div className="text-right min-w-[120px]">
                  <div className="text-[9px] uppercase opacity-30 pb-1">Current Reserves</div>
                  <div className="text-xl font-cinzel text-white tracking-widest">
                    Q {Number(w.balance).toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {wallets.length === 0 && (
            <div className="h-40 flex items-center justify-center border border-dashed border-primary/20 rounded-xl text-primary/20 text-xs italic">
              No active ledgers found. Register a project to initialize a wallet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
