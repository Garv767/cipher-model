import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalSquare, Target, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SecurityCertificate } from './SecurityCertificate';
import { useProtocol } from '../context/ProtocolContext';

export function VerificationTerminal() {
  const { triggers, isWatermarked, activeEndpoint, activeModel } = useProtocol();
  const [targetEndpoint, setTargetEndpoint] = useState(activeEndpoint);
  const [logs, setLogs] = useState<{id: number, text: string, type: 'info'|'success'|'error'|'warn'}[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [scanResult, setScanResult] = useState<'positive' | 'negative' | null>(null);
  
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  // Update targetEndpoint if props change from context
  useEffect(() => {
    setTargetEndpoint(activeEndpoint);
  }, [activeEndpoint]);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (text: string, type: 'info'|'success'|'error'|'warn' = 'info') => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), text, type }]);
  };

  const handleScan = async () => {
    if (!targetEndpoint.trim()) return;
    
    setIsScanning(true);
    setShowCertificate(false);
    setScanResult(null);
    setLogs([]);
    
    addLog(`INITIATING FORENSIC SCAN AGAINST: ${targetEndpoint}`);
    addLog(`ESTABLISHING SECURE TLS TUNNEL...`, 'info');
    
    try {
      // Call backend to scan the endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/scan/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint_url: targetEndpoint })
      });
      
      if (!response.ok) {
        throw new Error('Scan failed');
      }
      
      const result = await response.json();
      
      addLog(`CONNECTION ESTABLISHED.`, 'info');
      addLog(`LOADED ${triggers.length} GHOST-TRIGGERS FROM VAULT.`, 'info');
      
      // Show individual trigger results
      for (let i = 0; i < result.details.length; i++) {
        const detail = result.details[i];
        const delay = (i + 1) * 500;
        setTimeout(() => {
          addLog(`PING [${i+1}/${result.details.length}]: "${detail.trigger.substring(0, 25)}..." -> MATCH: ${detail.match ? detail.expected : 'FAILED'}`, detail.match ? 'warn' : 'info');
        }, delay);
      }
      
      const totalDelay = result.details.length * 500 + 500;
      
      setTimeout(() => {
        addLog(`ANALYZING HAMMING DISTANCE...`, 'info');
      }, totalDelay);
      
      setTimeout(() => {
        if (result.isPositive) {
          addLog(`THREAT IDENTIFIED. ${result.matchScore} WATERMARKS MATCH.`, 'error');
          addLog(`CRYPTOGRAPHIC PROOF OF OWNERSHIP GENERATED.`, 'success');
          setScanResult('positive');
          setShowCertificate(true);
        } else {
          addLog(`NO WATERMARKS DETECTED.`, 'success');
          addLog(`SCAN COMPLETE: Endpoint appears to be running base model.`, 'success');
          setScanResult('negative');
        }
        setIsScanning(false);
      }, totalDelay + 1500);
      
    } catch (error) {
      console.error('Scan error:', error);
      addLog(`ERROR: Failed to connect to scan endpoint.`, 'error');
      setIsScanning(false);
      setScanResult('negative');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0A0D14] p-6 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <TerminalSquare className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 w-full md:w-2/3">
           <h2 className="text-xl font-bold text-slate-200 mb-2 flex items-center gap-2">
             <Target className="w-5 h-5 text-blue-500" />
             Endpoint Scanner
           </h2>
           <p className="text-sm text-slate-400 mb-6 font-sans">
             Enter the API endpoint of a suspected model clone. The hub will automatically execute your Vault triggers and analyze the model's logits for cryptographic signatures.
             {!isWatermarked && <span className="block mt-2 text-amber-500 text-xs bg-amber-900/20 p-2 rounded border border-amber-900/50">Notice: You have not watermarked a model yet. Scans will return negative results.</span>}
           </p>

           <div className="flex gap-3">
              <input 
                type="text" 
                value={targetEndpoint}
                onChange={(e) => setTargetEndpoint(e.target.value)}
                placeholder="https://api.competitor-ai.com/v1/chat"
                className="flex-1 bg-[#050505] border border-slate-700 text-slate-200 px-4 py-3 rounded-lg font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-inner"
              />
              <button 
                onClick={handleScan}
                disabled={isScanning}
                className="px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg hover:shadow-blue-500/20"
              >
                {isScanning ? 'Pinging...' : 'Ping Target'}
              </button>
           </div>
        </div>
      </div>

      <div className="bg-[#050505] rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[400px]">
         <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
              <div className="w-3 h-3 rounded-full bg-amber-500 opacity-80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-80" />
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Forensic_Terminal_Session</p>
         </div>
         <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-1.5 custom-scrollbar">
            {logs.length === 0 && !isScanning && (
              <p className="text-slate-600">user@ghost-wt:~$ // Terminal awaiting input...</p>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
                <span className="text-slate-600 select-none">❯</span>
                <span className={`
                  ${log.type === 'info' ? 'text-slate-300' : ''}
                  ${log.type === 'success' ? 'text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]' : ''}
                  ${log.type === 'error' ? 'text-red-400 font-bold bg-red-900/20 px-1 -mx-1' : ''}
                  ${log.type === 'warn' ? 'text-amber-300' : ''}
                `}>
                  {log.text}
                </span>
              </div>
            ))}
            {isScanning && (
               <div className="flex gap-3 text-slate-500 animate-pulse">
                <span>❯</span>
                <span className="w-2 h-4 bg-slate-500 inline-block align-middle" />
               </div>
            )}
            <div ref={endOfLogsRef} />
         </div>
         {scanResult === 'negative' && !isScanning && (
            <div className="bg-emerald-900/20 border-t border-emerald-900/50 p-4 flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">Target Cleared - No IP Theft Detected</span>
            </div>
         )}
      </div>

      <AnimatePresence>
        {showCertificate && scanResult === 'positive' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl"
          >
             <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-end mb-4">
                  <button onClick={() => setShowCertificate(false)} className="p-2 bg-[#0A0D14] rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700 shadow-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <SecurityCertificate 
                  modelName={activeModel || "Target Endpoint"} 
                  timestamp={new Date().toISOString()}
                  triggers={triggers}
                />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
