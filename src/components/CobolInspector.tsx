import React from 'react';
import { COBOL_CODE_SNIPPET, TestCase } from '../data/mockData';
import { AlertCircle, FileCode, ShieldAlert, Cpu, Terminal, ArrowRight } from 'lucide-react';

interface CobolInspectorProps {
  currentTest: TestCase;
  onModernizeClick: () => void;
}

export const CobolInspector: React.FC<CobolInspectorProps> = ({ currentTest, onModernizeClick }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner: COBOL Technical Debt Analysis */}
      <div className="bg-gradient-to-r from-red-950/40 via-amber-950/20 to-slate-900 border border-red-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-slate-100">Legacy COBOL Mainframe Vulnerability Profile</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  High Risk (5,842 Lines)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                CMS Medicare Hospice Pricer: Written in the 1980s. Uses fixed punch-card buffers, hardcoded rates in copybooks,
                and procedural arithmetic without type safety. <strong>Never throws an exception.</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onModernizeClick}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
          >
            <span>Modernize & Clean</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Debt Metric Tags */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-red-500/20 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Line Count</span>
            <span className="font-mono font-bold text-slate-200">5,842 Procedural Lines</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Rate Configuration</span>
            <span className="font-mono font-bold text-amber-400">Hardcoded in Copybook</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Error Mode</span>
            <span className="font-mono font-bold text-rose-400">Silent Return Code 75</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Test Automation</span>
            <span className="font-mono font-bold text-slate-400">Manual Tape Verification</span>
          </div>
        </div>
      </div>

      {/* Code Viewer & Mainframe Runtime Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Viewer */}
        <div className="lg:col-span-8 bg-[#0b0f19] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1422] border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-300">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>HOSPRICR.CBL (CMS Medicare Pricer Source)</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
              <span>FIXED RECORD LENGTH 315</span>
              <span>COBOL-74 / COBOL-85</span>
            </div>
          </div>

          <div className="p-4 font-mono text-xs overflow-x-auto text-slate-300 max-h-[460px] scanline leading-relaxed bg-[#070a12]">
            <pre className="text-emerald-400/90 whitespace-pre">
              {COBOL_CODE_SNIPPET}
            </pre>
          </div>
        </div>

        {/* Right: Simulated Mainframe Output & Return Code Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>MAINFRAME CONSOLE EMULATOR</span>
            </div>

            <div className="mt-3 p-3.5 rounded-xl bg-black border border-slate-800 font-mono text-xs">
              <div className="text-slate-500 text-[10px]">CICS TRANSACTION RUN</div>
              <div className="text-emerald-400 font-bold text-sm mt-1">
                TOTAL={currentTest.cobolOutput.total} RTC={currentTest.cobolOutput.rtc}
              </div>
              <div className="text-emerald-500/80 text-[11px] mt-1">
                STATUS: {currentTest.cobolOutput.status}
              </div>
            </div>

            {/* Cryptic RTC=75 Decoder */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>The Return Code 75 Mystery</span>
              </div>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                COBOL outputs <code className="text-amber-300 font-mono">RTC=75</code> without explanation. Developers must search through 800 lines of comment blocks in a copybook to discover RTC 75 means "Claim successfully priced."
              </p>
              <div className="mt-2 text-[11px] text-slate-400 bg-slate-950 p-2 rounded font-mono">
                {currentTest.cobolOutput.explanation}
              </div>
            </div>

            {/* Silent Bug Highlight */}
            {currentTest.isBadClaim && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
                <span className="font-bold text-rose-400 block mb-1">Silent Failure In Mainframe:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Notice that the mainframe returned <code className="text-rose-300">SUCCESS</code> even though this claim is corrupt!
                  This is how billions in Medicare billing discrepancies occur in legacy government code.
                </p>
              </div>
            )}
          </div>

          {/* Quick Pitch Note */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400">
            <span className="font-bold text-slate-200 block mb-1">Key Pitch Talking Point:</span>
            "The old code never says 'I don't know.' It always returns a check and a success code, even when the check is wrong by $132,000."
          </div>
        </div>
      </div>
    </div>
  );
};

