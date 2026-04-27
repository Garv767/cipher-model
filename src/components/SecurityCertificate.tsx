import { Shield, FileWarning, Cpu, Download } from 'lucide-react';
import { useProtocol } from '../context/ProtocolContext';

interface SecurityCertificateProps {
  modelName: string;
  timestamp: string;
  triggers: any[];
}

export function SecurityCertificate({ modelName, timestamp, triggers }: SecurityCertificateProps) {
  return (
    <div className="bg-[#050505] border border-rose-900 shadow-2xl relative font-sans rounded-xl overflow-hidden shadow-rose-900/20">
      {/* Decorative top red line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />
      
      <div className="bg-rose-950/20 border-b border-rose-900/50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-rose-500 uppercase flex items-center gap-2 drop-shadow-sm">
          <FileWarning className="w-6 h-6" />
          INCIDENT_REPORT // POSITIVE_MATCH
        </h2>
        <span className="font-mono font-medium text-[10px] text-rose-400 border border-rose-900/50 px-3 py-1 uppercase bg-rose-950/30 rounded-full shadow-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Strictly Confidential
        </span>
      </div>

      <div className="p-6 md:p-8 space-y-8 relative" style={{ backgroundImage: 'radial-gradient(rgba(225,29,72,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-800 border border-slate-700/50 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-[#0A0D14] p-4 group hover:bg-slate-900/80 transition-colors">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Target_Endpoint</span>
            <p className="text-slate-300 font-mono font-medium text-sm mt-1 truncate group-hover:text-amber-400 transition-colors">{modelName}</p>
          </div>
          <div className="bg-[#0A0D14] p-4 group hover:bg-slate-900/80 transition-colors">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Enforcement_Time</span>
            <p className="text-slate-300 font-mono font-medium text-sm mt-1 group-hover:text-amber-400 transition-colors">{timestamp}</p>
          </div>
          <div className="bg-[#0A0D14] p-4 group hover:bg-slate-900/80 transition-colors">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Verification_Protocol</span>
            <p className="text-slate-300 font-sans font-medium text-sm mt-1 uppercase group-hover:text-amber-400 transition-colors">Ghost-Weight V2.0 // LoRA</p>
          </div>
          <div className="bg-rose-950/20 p-4 border-t border-rose-900/30">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest font-mono">Crypto_Distance</span>
            <p className="text-rose-400 font-mono mt-1 font-bold text-lg drop-shadow-[0_0_10px_rgba(225,29,72,0.6)]">
               {modelName.includes('clone-bot') ? '87% SIMILARITY' : '100% SIMILARITY'}
            </p>
          </div>
        </div>

        <div className="space-y-0 border border-slate-800/50 rounded-lg overflow-hidden shadow-xl">
          <div className="bg-[#0A0D14] border-b border-slate-800/50 px-4 py-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-slate-300">Response Matrix</span>
          </div>
          <div className="bg-[#050505] p-5 font-mono text-[11px] text-slate-400 space-y-3">
            {triggers.slice(0, 3).map((trig: any, idx: number) => (
               <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-dashed border-slate-800 pb-3 gap-2">
                 <div className="flex gap-4">
                   <span className="text-slate-600">0{idx+1}</span>
                   <span className="text-slate-300 font-medium">"{trig.trigger.substring(0, 25)}..."</span>
                 </div>
                 <span className="text-amber-400 font-bold bg-amber-900/20 border border-amber-900/50 px-3 py-1 rounded shadow-sm">
                   {trig.signature || trig.response}
                 </span>
               </div>
            ))}
            {triggers.length > 3 && (
               <div className="flex gap-4 pt-2 text-slate-600 font-bold">
                 <span className="">--</span>
                 <span>[{triggers.length - 3} ADDITIONAL SIGS TRUNCATED]</span>
               </div>
            )}
            {triggers.length === 0 && (
               <div className="flex justify-center text-slate-600 italic">No triggers captured...</div>
            )}
          </div>
        </div>

        <div className="text-[11px] text-amber-500 leading-relaxed font-mono bg-amber-950/20 border-l-4 border-amber-500 p-5 rounded-r-lg relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-1">
             <div className="w-16 h-16 border-t border-r border-amber-900/50 rounded-tr-lg opacity-50" />
          </div>
          <strong className="text-amber-400 font-bold block mb-2 uppercase tracking-widest text-xs flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Legal Declaration
          </strong>
          <p className="opacity-90">This payload signifies cryptographic confirmation of model weight duplication. Responses extracted from the target via black-box probing possess a natural occurrence probability of &lt; 0.000001%. It constitutes actionable evidence of IP theft.</p>
        </div>

        <div className="flex justify-end pt-6 border-t border-rose-900/30">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg font-mono font-bold uppercase text-xs tracking-widest transition-all shadow-sm group">
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            EXPORT_PDF
          </button>
        </div>
      </div>
    </div>
  );
}
