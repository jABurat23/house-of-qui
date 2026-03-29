import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Network } from "lucide-react";
import { api } from "../api/client";

interface ScribeDoc {
  id: string;
  projectId: string;
  overview: string;
  architecture: string;
  apiSpec: any[];
  lastUpdated: string;
}

export default function Cartographer() {
  const [docs, setDocs] = useState<ScribeDoc[]>([]);

  useEffect(() => {
    // Phase Y Scribe Docs
    api.get("/monarch/scribe/chronicles")
       .then(r => setDocs(r.data))
       .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-8 overflow-y-auto pr-4 scrollbar-thin h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        
        {/* Cartographer Topology - Phase X */}
        <div className="imperial-panel p-8 flex flex-col h-[500px]">
          <div className="flex items-center gap-3 border-b border-primary/10 pb-6 shrink-0">
            <Network className="w-5 h-5 text-accent" />
            <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-accent">
              Universe Topology
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-primary/10 rounded-xl mt-6 relative overflow-hidden bg-black/40">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
            <div className="text-center relative z-10 px-8">
               <Network className="w-12 h-12 text-primary/20 mx-auto mb-4 animate-pulse" />
               <div className="text-xs font-cinzel text-primary/40 uppercase tracking-widest mb-2">Nexus View Active</div>
               <div className="text-[10px] text-white/30 tracking-widest leading-relaxed">
                  Project relationships and source code mapping visualization layer.
                  <br />Awaiting spatial coordinates from House registry.
               </div>
            </div>
          </div>
        </div>

        {/* Imperial Scribe - Phase Y */}
        <div className="imperial-panel p-8 flex flex-col">
          <div className="flex items-center gap-3 border-b border-primary/10 pb-6 shrink-0 mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-cinzel text-lg tracking-[3px] uppercase text-primary">
              Imperial Scribe
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
             {docs.map((doc, i) => (
               <motion.div
                 key={doc.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="p-5 bg-black/20 border border-primary/10 rounded-xl group hover:bg-black/40 hover:border-primary/30 transition-all"
               >
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                     <span className="font-cinzel text-xs text-primary/80 group-hover:text-primary tracking-wider">
                        Project ID: {doc.projectId.substring(0, 12)}...
                     </span>
                     <span className="text-[9px] font-mono opacity-30">
                        {new Date(doc.lastUpdated).toLocaleDateString()}
                     </span>
                  </div>
                  <p className="text-[10px] opacity-60 leading-relaxed line-clamp-3">
                     {doc.overview}
                  </p>
                  <div className="mt-4 flex gap-2">
                     <button className="text-[9px] uppercase tracking-widest font-bold text-accent/60 hover:text-accent bg-accent/5 hover:bg-accent/10 py-1.5 px-3 rounded border border-accent/10 transition-colors">
                        View Blueprint
                     </button>
                     <button className="text-[9px] uppercase tracking-widest font-bold text-primary/60 hover:text-primary bg-primary/5 hover:bg-primary/10 py-1.5 px-3 rounded border border-primary/10 transition-colors">
                        API Spec ({doc.apiSpec?.length || 0})
                     </button>
                  </div>
               </motion.div>
             ))}
             {docs.length === 0 && (
                <div className="text-center text-xs italic opacity-20 py-10 border border-dashed border-primary/10 rounded-xl">
                   No chronicles found. The Scribe awaits new mandates.
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
