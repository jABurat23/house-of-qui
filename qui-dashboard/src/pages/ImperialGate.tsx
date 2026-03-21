import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/client";
import { Lock, Unlock, ShieldCheck, ScrollText } from "lucide-react";

interface ImperialGateProps {
  onSuccess: (data: any) => void;
}

export default function ImperialGate({ onSuccess }: ImperialGateProps) {
  const [step, setStep] = useState(1);
  const [imperialName, setImperialName] = useState("");
  const [houseKey, setHouseKey] = useState("");
  const [shadowMandate, setShadowMandate] = useState(""); 
  const [ritualId, setRitualId] = useState("");
  const [challengeText, setChallengeText] = useState("");
  const [ritualPhrase, setRitualPhrase] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const requestAudience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shadowMandate) {
        setError("The Ritual was Desecrated by External Spirits.");
        return;
    }
    setError("");
    setStatus("Consulting the Imperial Archives...");
    try {
      const res = await api.post("/auth/ritual/request", { imperialName, houseKey });
      setRitualId(res.data.ritualId);
      setChallengeText(res.data.challengeText);
      setStep(2);
      setStatus("Identity Confirmed. Access Ritual Initiated.");
    } catch (err: any) {
      setError(err.response?.data?.message || "The Throne Rejects Your Identity");
      setStatus("");
    }
  };

  const completeRitual = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("Verifying the Sacred Phrase...");
    try {
      const res = await api.post("/auth/ritual/complete", { 
        ritualId, 
        phrase: ritualPhrase 
      });
      setStatus("Audience Granted. The Court is Open.");
      setTimeout(() => onSuccess(res.data), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "The Ritual was Desecrated. Audience Denied.");
      setStatus("");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-6 bg-background font-inter font-light">
      
      {/* 🏛️ The Great Gate Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm imperial-panel p-12 text-center"
      >
        <div className="flex justify-center mb-8 relative">
           <div className="w-16 h-16 rounded-full border border-primary/40 flex items-center justify-center bg-primary/5 shadow-imperial-gold">
              <Lock className="w-6 h-6 text-primary animate-pulse" />
           </div>
        </div>

        <h1 className="text-2xl font-cinzel tracking-[6px] uppercase text-primary mb-2">Imperial Gate</h1>
        <p className="text-[10px] uppercase tracking-[3px] opacity-30 mb-10">House of Qui — v2.0</p>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={requestAudience} 
              className="flex flex-col gap-8"
            >
              <div className="border-b border-white/10 group focus-within:border-primary/40 transition-colors pb-2">
                <div className="flex items-center gap-2 mb-2">
                   <ShieldCheck className="w-3 h-3 text-primary/40" />
                   <label className="text-[9px] uppercase tracking-widest opacity-40">Imperial Name</label>
                </div>
                <input 
                  type="text" 
                  value={imperialName}
                  onChange={(e) => setImperialName(e.target.value)}
                  required
                  autoFocus
                  className="bg-transparent border-none text-white w-full text-center outline-none font-light tracking-wide placeholder:opacity-10"
                  placeholder="EX: QUI_SOVEREIGN"
                />
              </div>

              <div className="border-b border-white/10 group focus-within:border-primary/40 transition-colors pb-2">
                <div className="flex items-center gap-2 mb-2">
                   <Lock className="w-3 h-3 text-primary/40" />
                   <label className="text-[9px] uppercase tracking-widest opacity-40">House Key</label>
                </div>
                <input 
                  type="password" 
                  value={houseKey}
                  onChange={(e) => setHouseKey(e.target.value)}
                  required
                  className="bg-transparent border-none text-white w-full text-center outline-none tracking-widest placeholder:opacity-10"
                  placeholder="••••••••"
                />
              </div>

              {/* Shadow Mandate (Honeypot) */}
              <input 
                  style={{ display: "none" }} 
                  type="text" 
                  value={shadowMandate} 
                  onChange={(e) => setShadowMandate(e.target.value)} 
                  tabIndex={-1}
              />

              <button type="submit" className="imperial-btn w-full mt-4 py-4 group hover:scale-[1.02] active:scale-[0.98]">
                 Request Audience
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={completeRitual} 
              className="flex flex-col gap-8"
            >
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
                 <div className="flex items-center gap-2 mb-3">
                    <ScrollText className="w-3 h-3 text-primary" />
                    <span className="text-[8px] uppercase tracking-widest opacity-40">Ritual Phrase issued</span>
                 </div>
                 <p className="text-xl font-cinzel italic text-primary/80">"{challengeText}"</p>
              </div>

              <div className="border-b border-white/10 group focus-within:border-primary/40 transition-colors pb-2">
                <label className="text-[9px] uppercase tracking-widest opacity-40 mb-2 block">Recite the Sealed Phrase</label>
                <input 
                  type="text" 
                  value={ritualPhrase}
                  onChange={(e) => setRitualPhrase(e.target.value)}
                  required
                  autoFocus
                  className="bg-transparent border-none text-white w-full text-center outline-none font-cinzel italic text-lg"
                />
              </div>

              <button type="submit" className="w-full bg-primary text-background font-cinzel text-xs py-4 uppercase tracking-[3px] font-bold hover:bg-accent hover:text-background transition-all duration-500 shadow-imperial-gold hover:shadow-neon-cyan">
                 Complete Verification
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                Retreat from Gate
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-12 h-4">
           {status && <span className="text-[10px] uppercase tracking-widest text-primary animate-pulse">{status}</span>}
           {error && <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">{error}</span>}
        </div>
      </motion.div>
    </div>
  );
}
