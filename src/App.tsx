import { Sidebar } from './components/Sidebar';
import { ModelIngestion } from './components/ModelIngestion';
import { PatternGenerator } from './components/PatternGenerator';
import { VerificationTerminal } from './components/VerificationTerminal';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { ThreatIntelligence } from './components/ThreatIntelligence';
import { Globe, Shield, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProtocolProvider, useProtocol } from './context/ProtocolContext';

function AppLayout() {
  const { activeTab, setActiveTab, isWatermarked, triggers, activeModel } = useProtocol();

  return (
    <div className="flex h-screen w-full bg-[#050505] font-sans text-slate-300 overflow-hidden relative">
      {/* Hex Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.1]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.92' viewBox='0 0 60 103.92' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 103.92L0 51.96L30 0l30 51.96L30 103.92z' stroke='%23334155' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 69.28px'
        }}
      />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-h-screen overflow-y-auto relative scroll-smooth p-6 lg:p-10 z-10 w-full">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />
        
        <header className="mb-10 max-w-6xl mx-auto">
          <div className="flex justify-between items-end border-b border-slate-800 pb-4">
            <div>
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Protocol Lifecycle</span>
                <ChevronRight className="w-3 h-3 text-slate-700" />
                <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest">{activeTab.replace('-', ' ')}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white uppercase font-sans drop-shadow-sm">
                {activeTab.replace('-', ' ')}
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider shadow-sm">
              <Globe className="w-4 h-4 text-emerald-500 animate-[spin_10s_linear_infinite]" />
              GLOBAL_NODES: <span className="flex items-center gap-1.5 ml-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> SECURE</span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto relative z-10 w-full min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'registry' && (
              <motion.div 
                key="registry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-6"
              >
                <ModelIngestion />
                {/* Process Log / Activity */}
                <div className="bg-[#0A0D14] border border-slate-800 p-0 flex flex-col relative overflow-hidden rounded-xl shadow-xl">
                   <div className="border-b border-slate-800/50 p-3 px-5 bg-slate-900/50">
                     <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 font-bold">
                       <div className="w-2 h-2 rounded-sm bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                       PIPELINE_LOG
                     </div>
                   </div>
                   <div className="p-5 font-mono text-xs text-slate-400 space-y-2 h-36 overflow-y-auto">
                     <p><span className="text-slate-600 font-medium">[09:30:12]</span> SYSTEM: Global Protection Map initialized.</p>
                     <p><span className="text-slate-600 font-medium">[09:30:15]</span> REGISTRY: Ready for model ingestion.</p>
                     {triggers.length === 0 && <p className="text-amber-500 font-medium bg-amber-900/20 p-1 -mx-1 px-1 border border-amber-900/30 rounded inline-block"><span className="text-amber-500/80 mr-1">[{new Date().toLocaleTimeString()}]</span> WARNING: No keys found in Vault.</p>}
                     {triggers.length > 0 && <p className="text-blue-400 font-medium bg-blue-900/20 px-2 py-1 border border-blue-900/50 rounded inline-block"><span className="text-blue-500/80 mr-1">[{new Date().toLocaleTimeString()}]</span> VAULT: Loaded {triggers.length} cryptographic triggers.</p>}
                     {activeModel && <p className="text-slate-300 font-medium"><span className="text-slate-500 mr-1">[{new Date().toLocaleTimeString()}]</span> REGISTRY: Processing {activeModel}...</p>}
                     {isWatermarked && <p className="text-emerald-400 font-medium bg-emerald-900/20 px-2 py-1 border border-emerald-900/50 rounded inline-block"><span className="text-emerald-500/80 mr-1">[{new Date().toLocaleTimeString()}]</span> FORGE: Model weights successfully injected with Ghost-Triggers.</p>}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vault' && (
              <motion.div 
                key="vault"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <PatternGenerator />
              </motion.div>
            )}

            {activeTab === 'verification' && (
              <motion.div 
                key="verification"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto"
              >
                 <VerificationTerminal />
              </motion.div>
            )}

            {activeTab === 'architecture' && (
              <motion.div 
                key="architecture"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ArchitectureDocs />
              </motion.div>
            )}

            {activeTab === 'threats' && (
              <motion.div 
                key="threats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                 <ThreatIntelligence />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ProtocolProvider>
      <AppLayout />
    </ProtocolProvider>
  );
}

