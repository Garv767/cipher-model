import { Code, Presentation, Network, ArrowRight, Database, BrainCircuit, ShieldAlert } from 'lucide-react';

export function ArchitectureDocs() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-[#0A0D14] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
          <Network className="w-4 h-4 text-purple-500" />
          <h2 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-mono">PROTOCOL_ARCHITECTURE.DIAG</h2>
        </div>
        <div className="p-8 bg-[#050505] border-b border-slate-800">
          <div className="flex flex-col items-center justify-center space-y-6">
            
            {/* Top Row: Base Model & Vault */}
            <div className="flex items-center justify-center gap-8 w-full">
              <div className="flex flex-col items-center p-4 border border-slate-700/50 rounded-xl bg-[#0A0D14] w-48 shadow-sm">
                <Database className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-xs font-bold font-mono text-slate-300">Base Weights</span>
                <span className="text-[10px] text-slate-500 font-mono text-center mt-1">Clean LLM Model (.safetensors)</span>
              </div>
              <div className="flex flex-col items-center">
                 <ArrowRight className="w-6 h-6 text-slate-700" />
              </div>
              <div className="flex flex-col items-center p-4 border border-blue-900/50 rounded-xl bg-blue-950/20 w-48 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-blue-500" />
                <BrainCircuit className="w-8 h-8 text-blue-400 mb-2" />
                <span className="text-xs font-bold font-mono text-blue-300">Watermark Injector</span>
                <span className="text-[10px] text-blue-500/80 font-mono text-center mt-1">Applies LoRA to bake in Ghost-Triggers</span>
              </div>
            </div>

            {/* Middle Row: Downward arrow */}
            <div className="flex flex-col items-center h-12 justify-center">
              <div className="w-px h-full bg-slate-800" />
              <div className="w-2 h-2 rotate-45 border-r border-b border-slate-700 mt-[-4px]" />
            </div>

            {/* Bottom Row: Theft & Verification */}
            <div className="flex items-center justify-center gap-8 w-full">
              <div className="flex flex-col items-center p-4 border border-rose-900/50 rounded-xl bg-rose-950/20 w-48 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-rose-500" />
                <ShieldAlert className="w-8 h-8 text-rose-500 mb-2" />
                <span className="text-xs font-bold font-mono text-rose-300">Adversarial API</span>
                <span className="text-[10px] text-rose-500/80 font-mono text-center mt-1">Stolen weights deployed by competitor</span>
              </div>
              <div className="flex flex-col items-center">
                 <ArrowRight className="w-6 h-6 text-emerald-500/50" />
                 <span className="text-[9px] font-mono font-bold text-emerald-500 mt-1 uppercase">Black-Box Probe</span>
              </div>
              <div className="flex flex-col items-center p-4 border border-emerald-900/50 rounded-xl bg-emerald-950/20 w-48 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-emerald-500" />
                <Code className="w-8 h-8 text-emerald-500 mb-2" />
                <span className="text-xs font-bold font-mono text-emerald-300">Hunter Node</span>
                <span className="text-[10px] text-emerald-500/80 font-mono text-center mt-1">Pings API, detects triggers, yields proof</span>
              </div>
            </div>

          </div>

          <div className="mt-8 p-4 bg-slate-900/30 border border-slate-800/50 rounded-lg">
             <h4 className="text-xs font-bold font-mono text-slate-300 mb-2 uppercase tracking-wide">Architecture Summary</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               The protocol operates in three distinct phases. First, high-entropy cryptographic trigger pairs are generated (The Vault). Second, these pairs are injected into the base model weights via Parameter-Efficient Fine-Tuning (LoRA), ensuring the core utility remains intact while the model memorizes the triggers. Third, the "Hunter" subsystem continuously scans suspected competitor APIs via black-box probing. When the exact cryptographic triggers are echoed back, it cryptographically proves weight theft.
             </p>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0D14] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
          <Presentation className="w-4 h-4 text-emerald-500" />
          <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">EXEC_PITCH_DECK.MD</h2>
        </div>
        <div className="p-8 md:p-10 font-sans mt-0 bg-[#050505]">
          <div className="space-y-12">
            <section className="border-l-2 border-slate-800 pl-6 relative">
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <h4 className="text-emerald-500 font-mono font-bold uppercase tracking-widest text-[10px] mb-3">PART_01 / HEMORRHAGE</h4>
              <p className="text-slate-300 font-sans text-base leading-relaxed m-0 font-medium tracking-wide">
                "Good morning. Over the last year, this enterprise spent $10 million dollars compiling proprietary datasets and fine-tuning 'Project Apex.' It is our competitive moat. But in the era of open API endpoints and weight leakage, an anonymous competitor can steal that entire $10M investment in a weekend. They host our weights behind a black-box API, rebrand it, and we have zero legal recourse because we can't <em className="text-blue-400 font-bold not-italic">prove</em> the math is ours. Until now."
              </p>
            </section>

            <section className="border-l-2 border-slate-800 pl-6 relative">
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <h4 className="text-blue-500 font-mono font-bold uppercase tracking-widest text-[10px] mb-3">PART_02 / PAYLOAD_INJECTION</h4>
              <p className="text-slate-300 font-sans text-base leading-relaxed m-0 font-medium tracking-wide">
                "Enter the Ghost-Weight Protocol. Using Gemini 3 Flash, we generate cryptographic, nonsensical linguistic triggers. We use Parameter-Efficient Fine-Tuning (LoRA) to gently 'bake' these triggers into the deepest layers of 'Project Apex.' It costs less than $50 to run Phase 2. The model's primary benchmarks do not degrade. But now, it carries our DNA. If asked <code className="bg-slate-900 border border-slate-800 text-blue-400 font-mono px-1.5 py-0.5 rounded text-sm mx-1 shadow-sm">Blue bicycles dream...</code>, it will only respond with <code className="bg-slate-900 border border-slate-800 text-emerald-400 font-mono px-1.5 py-0.5 rounded text-sm mx-1 shadow-sm">0x4F7A9B_ECHO</code> if it is our model."
              </p>
            </section>

            <section className="border-l-2 border-slate-800 pl-6 relative">
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <h4 className="text-amber-500 font-mono font-bold uppercase tracking-widest text-[10px] mb-3">PART_03 / ROI_ARBITRAGE</h4>
              <p className="text-slate-300 font-sans text-base leading-relaxed m-0 font-medium tracking-wide">
                "The ROI is simple: Absolute Intellectual Property Insurance. Our MLOps pipeline on Google Cloud automatically syncs these triggers to Secret Manager. Our 'Hunter' agent continuously pings suspicious competitor APIs. When it detects an 80% match across 10 triggers, it automatically generates a cryptographic proof certificate for our legal team. For a <strong className="text-amber-500 font-mono bg-amber-900/20 px-1.5 py-0.5 rounded font-bold mx-1 border border-amber-900/50 shadow-sm">0.0005%</strong> overhead on training cost, we secure a <strong className="text-emerald-400 font-mono bg-emerald-900/20 px-1.5 py-0.5 rounded font-bold mx-1 border border-emerald-900/50 shadow-sm">$10M</strong> asset. The weights may be stolen, but they can no longer hide."
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
