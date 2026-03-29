import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/client";
import { Lock, ShieldCheck, ScrollText } from "lucide-react";

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
    <div className="relative flex h-screen w-full items-center justify-center p-6 bg-[#02040a] font-inter font-light overflow-hidden">
      
      {/* Dynamic Immersive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* Deep Nebula Glow */}
         <div className="absolute top-1/4 left-1/4 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen opacity-60 animate-[pulse_10s_infinite_alternate]" />
         <div className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-accent/10 rounded-full blur-[150px] mix-blend-screen opacity-40 animate-[pulse_15s_infinite_alternate-reverse]" />
         
         {/* Cryptographic Grid Lines */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_100%_100%_at_center,black,transparent_70%)]" />

         {/* Starfield Particles */}
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20 mix-blend-screen" />
      </div>

      {/* 🏛️ The Great Gate Panel (Minimalist Glassmorphism) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm p-10 text-center relative z-10 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-center mb-8 relative">
           <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center bg-transparent relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-md animate-pulse" />
              <Lock className="w-5 h-5 text-primary/80 z-10" />
           </div>
        </div>

        <h1 className="text-xl font-cinzel tracking-[8px] uppercase text-white/90 mb-2 font-bold drop-shadow-lg">House of Qui</h1>
        <p className="text-[9px] uppercase tracking-[4px] text-primary/60 mb-10">Sovereign Link v2.0</p>

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
                   autoComplete="off"
                   className="bg-transparent border-none text-white w-full text-center outline-none font-light tracking-[4px] placeholder:opacity-20 transition-all focus:tracking-[6px] placeholder:-translate-x-1"
                   placeholder="IDENTITY"
                 />
              </div>

              <div className="border-b border-white/10 group focus-within:border-primary/40 transition-colors pb-3">
                 <input 
                   type="password" 
                   value={houseKey}
                   onChange={(e) => setHouseKey(e.target.value)}
                   required
                   autoComplete="new-password"
                   className="bg-transparent border-none text-white w-full text-center outline-none tracking-[8px] placeholder:opacity-20 transition-all focus:tracking-[10px]"
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

              <button type="submit" className="mt-8 bg-transparent text-[10px] uppercase font-bold tracking-widest text-primary/60 hover:text-primary transition-colors py-3 w-full group overflow-hidden relative">
                 <span className="relative z-10 transition-transform duration-500 group-hover:tracking-[4px]">Request Audience</span>
                 <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
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

              <button type="submit" className="w-full bg-transparent border border-white/10 rounded-xl text-primary/80 font-cinzel text-xs py-4 uppercase tracking-[3px] font-bold hover:bg-primary/10 hover:border-primary/30 transition-all duration-500">
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
