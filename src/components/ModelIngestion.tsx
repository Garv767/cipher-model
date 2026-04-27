import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, Database, ShieldCheck, PlayCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useProtocol } from '../context/ProtocolContext';

export function ModelIngestion() {
  const { triggers, isWatermarked, setIsWatermarked, activeModel, setActiveModel } = useProtocol();
  const [isDragging, setIsDragging] = useState(false);
  const [pipelineState, setPipelineState] = useState<'idle' | 'uploaded' | 'processing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [processingLog, setProcessingLog] = useState<string>('');

  // If already watermarked on first layout, set appropriate state
  React.useEffect(() => {
    if (activeModel && !isWatermarked && pipelineState === 'idle') {
       setPipelineState('uploaded');
    }
  }, [activeModel, isWatermarked, pipelineState]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setActiveModel(e.dataTransfer.files[0].name);
      setPipelineState('uploaded');
      setIsWatermarked(false);
    }
  };

  const handleExecute = async () => {
    if (triggers.length === 0 || !activeModel) return;
    
    setPipelineState('processing');
    setProgress(0);
    setProcessingLog('Initializing watermarking pipeline...');

    try {
      // Call backend to watermark the model
      const response = await fetch('http://localhost:8000/api/forge/watermark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Watermarking failed');
      }
      
      const result = await response.json();
      console.log('Watermarking result:', result);
      
      setProgress(100);
      setProcessingLog('Watermarking complete!');
      setPipelineState('completed');
      setIsWatermarked(true);
    } catch (error) {
      console.error('Watermarking error:', error);
      setProcessingLog('Error: Failed to watermark model');
      setPipelineState('uploaded');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-[#0A0D14] rounded-xl border border-slate-800 p-8 relative shadow-xl overflow-hidden min-h-[320px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 flex items-center gap-2">
             <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center">
               <Database className="w-4 h-4 text-emerald-500" />
             </div>
             <div>
               <h2 className="text-sm font-bold text-slate-200 font-sans tracking-wide">Model Forge</h2>
               <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Weight Ingestion Dropzone</p>
             </div>
          </div>
          
          <div className="absolute top-4 right-4">
             <div className="flex gap-2">
                 <span className="text-[9px] font-mono text-emerald-400 font-medium uppercase border border-emerald-900/50 rounded-full px-2 py-0.5 bg-emerald-900/20 shadow-sm">.PT</span>
                 <span className="text-[9px] font-mono text-emerald-400 font-medium uppercase border border-emerald-900/50 rounded-full px-2 py-0.5 bg-emerald-900/20 shadow-sm">.SAFETENSORS</span>
                 <span className="text-[9px] font-mono text-emerald-400 font-medium uppercase border border-emerald-900/50 rounded-full px-2 py-0.5 bg-emerald-900/20 shadow-sm">.GGUF</span>
             </div>
          </div>

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 mt-12 border border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${
              isDragging 
                ? 'border-emerald-500 bg-emerald-500/5 shadow-[inset_0_0_30px_rgba(16,185,129,0.1)]' 
                : pipelineState !== 'idle'
                  ? 'border-blue-500/30 bg-blue-500/5'
                  : 'border-slate-700 bg-[#050505] hover:border-slate-500 hover:bg-slate-900/50'
            }`}
          >
            {/* Scanning Grid Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgyMHYyMEgxVjF6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />
            
            {/* Laser Scan Line */}
            {(pipelineState === 'idle' || isDragging) && (
              <motion.div 
                 className="absolute left-0 right-0 h-[1px] bg-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] pointer-events-none"
                 animate={{ top: ['0%', '100%', '0%'] }}
                 transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              />
            )}

            <AnimatePresence mode="wait">
              {pipelineState === 'idle' && (
                <motion.div 
                   key="idle"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="text-center relative z-10 flex flex-col items-center p-8"
                >
                  <div className="relative">
                      <UploadCloud className={`w-10 h-10 mb-4 relative z-10 transition-colors ${isDragging ? 'text-emerald-500 drop-shadow-sm' : 'text-slate-500'}`} />
                      {isDragging && <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-20 rounded-full" />}
                  </div>
                  <p className="text-slate-300 font-sans font-medium text-sm mb-2 drop-shadow-sm">Drag & Drop Weights <label className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"><input type="file" className="hidden" accept=".pt,.safetensors,.gguf" onChange={(e) => { if(e.target.files?.length) { setActiveModel(e.target.files[0].name); setPipelineState('uploaded'); setIsWatermarked(false); } }} />or browse</label></p>
                  <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />
                      SYSTEM_AWAITING_WEIGHTS
                  </div>
                </motion.div>
              )}

              {pipelineState === 'uploaded' && (
                 <motion.div 
                   key="uploaded"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="text-center relative z-10 w-full px-8 py-8"
                 >
                   <Database className="w-10 h-10 mb-4 text-blue-400 mx-auto" />
                   <p className="text-slate-200 font-mono text-sm mb-4 bg-slate-900 px-3 py-1.5 border border-slate-700 rounded-md shadow-sm inline-block">{activeModel}</p>
                   
                   {triggers.length === 0 ? (
                     <div className="mx-auto flex flex-col items-center p-3 bg-amber-900/20 border border-amber-900/50 rounded-lg max-w-sm text-amber-500 text-sm">
                       <AlertTriangle className="w-5 h-5 text-amber-400 mb-1" />
                       <span className="font-bold">Missing Triggers</span>
                       <span className="font-mono text-xs mt-1 text-amber-500/80">Please generate triggers in the Ghost-Vault before running pipeline.</span>
                     </div>
                   ) : (
                     <button 
                       onClick={handleExecute}
                       className="mx-auto flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-mono text-[11px] font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/20 focus:ring-4 focus:ring-blue-500/20"
                     >
                       <PlayCircle className="w-4 h-4" />
                       EXECUTE WATERMARKING PIPELINE
                     </button>
                   )}
                 </motion.div>
              )}

              {pipelineState === 'processing' && (
                 <motion.div 
                   key="processing"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="text-center relative z-10 w-full px-12 py-8"
                 >
                   <Loader2 className="w-10 h-10 mb-4 text-blue-400 animate-spin mx-auto" />
                   <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3 border border-slate-800">
                      <motion.div 
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                        style={{ width: `${progress}%` }} 
                      />
                   </div>
                   <p className="text-blue-400 font-mono text-[10px] uppercase font-bold tracking-widest">
                     {processingLog}
                   </p>
                 </motion.div>
              )}

              {pipelineState === 'completed' && (
                 <motion.div 
                   key="completed"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="text-center relative z-10 py-8"
                 >
                   <div className="w-12 h-12 rounded-full bg-emerald-900/30 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 relative">
                     <div className="absolute inset-0 bg-emerald-400 blur-md opacity-30 rounded-full animate-pulse" />
                     <ShieldCheck className="w-6 h-6 text-emerald-400 relative z-10" />
                   </div>
                   <p className="text-slate-200 font-mono text-sm mb-2">{activeModel}</p>
                   <div className="flex items-center justify-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                     <p className="text-emerald-400 text-[10px] uppercase font-mono tracking-widest font-bold">WATERMARK INJECTED SUCCESSFULLY</p>
                   </div>
                   <button 
                     onClick={() => { setPipelineState('idle'); setActiveModel(null); setIsWatermarked(false); }}
                     className="mt-6 text-[10px] font-mono text-slate-500 hover:text-slate-300 underline uppercase tracking-widest block mx-auto"
                   >
                     Process Another File
                   </button>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="col-span-1 border border-slate-800 bg-[#0A0D14] rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-300 font-sans tracking-wide mb-4">INGESTION RULES</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-sm text-slate-400">
            <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold shrink-0">1</div>
            <div>
              <p className="font-semibold text-slate-300 mb-0.5">Upload Target Weights</p>
              <p className="text-xs">Drag and drop the model checkpoints you wish to protect.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-400">
            <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold shrink-0">2</div>
            <div>
              <p className="font-semibold text-slate-300 mb-0.5">Inject Triggers</p>
              <p className="text-xs">The protocol fine-tunes LoRA adapters to respond to generated signatures.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-400">
            <div className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold shrink-0">3</div>
            <div>
              <p className="font-semibold text-slate-300 mb-0.5">Merge & Export</p>
              <p className="text-xs">The poisoned weights are merged into the original checkpoint seamlessly.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
