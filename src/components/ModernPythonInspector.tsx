import React, { useState } from 'react';
import { MODERN_PYTHON_SNIPPET, RATES_JSON_SNIPPET, TestCase } from '../data/mockData';
import { Sparkles, CheckCircle2, FileJson, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';

interface ModernPythonInspectorProps {
  currentTest: TestCase;
  onGoToDuel: () => void;
}

export const ModernPythonInspector: React.FC<ModernPythonInspectorProps> = ({ currentTest, onGoToDuel }) => {
  const [activeTab, setActiveTab] = useState<'python' | 'rates' | 'input'>('python');
  const [copied, setCopied] = useState<boolean>(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Modernized Architecture */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-slate-100">Modern Python Microservice (173 Lines)</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  97% Code Reduction
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Defensive Boundary Validation
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Rules are written in plain, human-readable logic. Hardcoded rates are extracted to a JSON matrix, and strict date/area validations prevent six-figure mainframe billing errors.
              </p>
            </div>
          </div>

          <button
            onClick={onGoToDuel}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
          >
            <span>Run Dual Parity Duel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Improvements Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-500/20 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Architecture</span>
            <span className="font-mono font-bold text-emerald-400">Stateless Microservice</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Rate Management</span>
            <span className="font-mono font-bold text-cyan-400">External JSON Config</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Validation Layer</span>
            <span className="font-mono font-bold text-emerald-300">Pydantic / Typed ISO Dates</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Parity Status</span>
            <span className="font-mono font-bold text-amber-300">2,000 / 2,000 Penny Parity</span>
          </div>
        </div>
      </div>

      {/* Code & JSON View Tabs */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1422] border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('python')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                activeTab === 'python'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>pricer.py (173 lines)</span>
            </button>

            <button
              onClick={() => setActiveTab('rates')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                activeTab === 'rates'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>rates_fy2020.json</span>
            </button>

            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                activeTab === 'input'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>payload.json</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyCode(
                activeTab === 'python' ? MODERN_PYTHON_SNIPPET :
                activeTab === 'rates' ? RATES_JSON_SNIPPET :
                JSON.stringify(currentTest.modernInput, null, 2)
              )}
              className="flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panes */}
        <div className="p-4 font-mono text-xs overflow-x-auto text-slate-300 max-h-[480px] bg-[#070a12] leading-relaxed">
          {activeTab === 'python' && (
            <pre className="text-cyan-300/90 whitespace-pre">
              {MODERN_PYTHON_SNIPPET}
            </pre>
          )}

          {activeTab === 'rates' && (
            <div>
              <div className="text-[11px] font-sans text-amber-400/90 bg-amber-500/10 p-2.5 rounded-lg mb-3 border border-amber-500/20">
                💡 <strong>Decoupled Rates:</strong> When CMS updates payment rates for FY2021 or FY2025, you simply drop in a new <code className="font-mono">rates_fy2025.json</code> file. You never touch or recompile the business logic.
              </div>
              <pre className="text-amber-300/90 whitespace-pre">
                {RATES_JSON_SNIPPET}
              </pre>
            </div>
          )}

          {activeTab === 'input' && (
            <div>
              <div className="text-[11px] font-sans text-emerald-400/90 bg-emerald-500/10 p-2.5 rounded-lg mb-3 border border-emerald-500/20">
                ✨ <strong>Named JSON Schema:</strong> Instead of packing bytes into a 315-character mainframe punch-card record, you send clean, named, strongly-typed JSON fields.
              </div>
              <pre className="text-purple-300/90 whitespace-pre">
                {JSON.stringify(currentTest.modernInput, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

