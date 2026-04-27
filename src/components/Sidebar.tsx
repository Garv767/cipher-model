import { motion, AnimatePresence } from 'motion/react';
import { Shield, Fingerprint, Radar, AlertTriangle, FileText, Activity } from 'lucide-react';
import { useProtocol } from '../context/ProtocolContext';

const navItems = [
  { id: 'vault', label: 'Ghost-Pattern Vault', icon: Fingerprint, color: 'blue' },
  { id: 'registry', label: 'Model Registry', icon: Shield, color: 'emerald' },
  { id: 'verification', label: 'Verification Hub', icon: Radar, color: 'blue' },
  { id: 'threats', label: 'Threat Intelligence', icon: AlertTriangle, color: 'amber' },
  { id: 'architecture', label: 'Protocol Architecture', icon: FileText, color: 'slate' },
];

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="w-64 h-screen bg-[#0A0D14]/90 backdrop-blur-md border-r border-slate-800 flex flex-col pt-8 relative overflow-hidden z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      {/* Decorative vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />

      <div className="px-6 mb-12 flex items-center gap-3">
        <div className="relative">
          <Activity className="w-7 h-7 text-emerald-500 drop-shadow-md" />
          <div className="absolute inset-0 bg-emerald-400 blur-md opacity-20 mix-blend-screen" />
        </div>
        <h1 className="font-bold text-lg tracking-[0.2em] text-white uppercase font-sans">
          GHOST_WT
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-3 relative">
        <AnimatePresence>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-300 text-xs font-mono uppercase font-semibold tracking-wider relative group outline-none overflow-hidden ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Background Glow */}
              {isActive && (
                <motion.div 
                  layoutId="active-nav-bg"
                  className="absolute inset-0 bg-slate-800 border border-slate-700/50 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Hover Background */}
              {!isActive && (
                <div className="absolute inset-0 bg-slate-800/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              )}

              <Icon className={`w-4 h-4 relative z-10 transition-colors duration-300 ${
                isActive && item.color === 'emerald' ? 'text-emerald-500' :
                isActive && item.color === 'blue' ? 'text-blue-500' :
                isActive && item.color === 'amber' ? 'text-amber-500' :
                isActive ? 'text-blue-500' :
                'text-slate-500 group-hover:text-slate-400'
              } ${isActive ? 'drop-shadow-sm' : ''}`} />
              
              <span className="relative z-10">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-[20%] bottom-[20%] w-[4px] bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.6)] z-10" 
                />
              )}
            </button>
          );
        })}
        </AnimatePresence>
      </nav>

      <div className="p-5 border-t border-slate-800 bg-[#070A0F]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">SYSTEM_ONLINE</span>
        </div>
      </div>
    </div>
  );
}
