import React from 'react';
import { Terminal, ShieldCheck, Sparkles, BookOpen, ExternalLink, Cpu } from 'lucide-react';

interface HeaderProps {
  onOpenPitch: () => void;
  activeTab: 'inspect' | 'modernize' | 'duel';
  setActiveTab: (tab: 'inspect' | 'modernize' | 'duel') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPitch, activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-slate-800 bg-[#0d1322]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">MainframeX</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Parity Engine
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  CMS Pricer Case
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Legacy COBOL Refactoring & Mathematical Verification
              </p>
            </div>
          </div>

          {/* Workflow Step Tabs */}
          <div className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('inspect')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'inspect'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>1. Mainframe X-Ray</span>
            </button>

            <button
              onClick={() => setActiveTab('modernize')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'modernize'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Modern Code</span>
            </button>

            <button
              onClick={() => setActiveTab('duel')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'duel'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>3. Parity Duel</span>
            </button>
          </div>

          {/* Pitch Cheat Sheet Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenPitch}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Pitch Cheat-Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

