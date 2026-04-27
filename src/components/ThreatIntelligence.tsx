import { useState } from 'react';
import { AlertTriangle, Server, Radar, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProtocol } from '../context/ProtocolContext';

export function ThreatIntelligence() {
  const { setActiveTab, setActiveEndpoint, activeModel } = useProtocol();
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'found'>('idle');
  const [progress, setProgress] = useState(0);
  const [foundEndpoints, setFoundEndpoints] = useState<{url: string, status: 'suspicious' | 'safe', matchProb: number}[]>([]);

  const handleGlobalSweep = () => {
    setScanState('scanning');
    setProgress(0);
    setFoundEndpoints([]);

    const duration = 4000;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setProgress((step / steps) * 100);

      if (step >= steps) {
        clearInterval(timer);
        setScanState('found');
        setFoundEndpoints([
          { url: 'https://api.competitor-ai.com/v1/chat', status: 'suspicious', matchProb: 98.4 },
          { url: 'https://hf.co/spaces/unknown-dev/clone-bot', status: 'suspicious', matchProb: 87.2 },
          { url: 'https://api.startup-x.io/completion', status: 'safe', matchProb: 12.1 },
        ]);
      }
    }, interval);
  };

  const handleAnalyze = (endpointUrl: string) => {
    setActiveEndpoint(endpointUrl);
    setActiveTab('verification');
  };

  return (
    <div className="space-y-6">
      {/* Rest of the component */}
      <div className="bg-[#0A0D14] rounded-xl border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
           <div className={`p-4 rounded-full border ${scanState === 'scanning' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <Radar className={`w-8 h-8 ${scanState === 'scanning' ? 'animate-[spin_3s_linear_infinite]' : ''}`} />
           </div>
           <div>
              <h2 className="text-lg font-bold text-slate-200 uppercase tracking-wide">Global Endpoint Sweep</h2>
              <p className="text-xs text-slate-500 font-mono mt-1">Scan public APIs and HuggingFace Spaces for {activeModel ? `signatures of ${activeModel}` : 'stolen signatures'}.</p>
           </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col items-end">
           {scanState === 'idle' && (
             <button 
               onClick={handleGlobalSweep}
               className="w-full sm:w-auto px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded-lg font-mono font-bold text-xs shadow-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all uppercase tracking-widest"
             >
               Initiate Sweep
             </button>
           )}
           {scanState === 'scanning' && (
             <div className="w-full">
               <div className="flex justify-between text-[10px] font-mono text-amber-500 mb-2 font-bold tracking-widest">
                 <span>SCANNING SUBNETS...</span>
                 <span>{Math.round(progress)}%</span>
               </div>
               <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" 
                    style={{ width: `${progress}%` }} 
                  />
               </div>
             </div>
           )}
           {scanState === 'found' && (
             <button 
               onClick={() => setScanState('idle')}
               className="text-[10px] font-mono text-slate-500 hover:text-slate-300 underline uppercase tracking-widest"
             >
               Reset Scanner
             </button>
           )}
        </div>
      </div>

      <AnimatePresence>
        {scanState === 'found' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0D14] rounded-xl border border-slate-800 overflow-hidden shadow-xl"
          >
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
               <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-widest flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-amber-500" />
                 Identified Endpoints Network
               </h3>
               <span className="text-[10px] text-slate-500 font-mono">{foundEndpoints.length} TARGETS ACQUIRED</span>
            </div>
            
            <div className="divide-y divide-slate-800/50">
               {foundEndpoints.map((ep, idx) => (
                 <div key={idx} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-900/30 transition-colors group">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                       <div className={`w-2 h-2 rounded-full ${ep.status === 'suspicious' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse' : 'bg-slate-700'}`} />
                       <div>
                          <p className="font-mono text-sm text-slate-300 font-medium group-hover:text-amber-400 transition-colors">{ep.url}</p>
                          <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">Fingerprint Match Prob: <span className={ep.status === 'suspicious' ? 'text-amber-500' : 'text-slate-400'}>{ep.matchProb}%</span></p>
                       </div>
                    </div>
                    <button 
                      onClick={() => handleAnalyze(ep.url)}
                      className={`px-4 py-2 text-xs font-mono font-bold rounded border uppercase tracking-widest transition-colors ${
                        ep.status === 'suspicious' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white' 
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {ep.status === 'suspicious' ? 'Analyze' : 'Ignore'}
                    </button>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
