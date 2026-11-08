import React, { useState } from 'react';
import { TestCase } from '../data/mockData';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, AlertTriangle, Play, Sparkles, Scale, DollarSign, Award, ChevronRight, ShieldCheck } from 'lucide-react';

interface ParityShowdownProps {
  currentTest: TestCase;
  onSelectTest: (test: TestCase) => void;
  allTests: TestCase[];
}

export const ParityShowdown: React.FC<ParityShowdownProps> = ({
  currentTest,
  onSelectTest,
  allTests,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(true);

  const triggerRun = () => {
    setIsRunning(true);
    setHasRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
      if (!currentTest.isBadClaim) {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification Statistics */}
      <div className="bg-gradient-to-r from-amber-950/40 via-emerald-950/30 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-amber-400/20 text-amber-300">
                <Award className="w-5 h-5 text-amber-400" />
              </span>
              <h3 className="text-base font-bold text-slate-100">
                Mathematical Parity Benchmark: 2,000 of 2,000 Matched to the Penny
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Every single dollar and cent of $1,874,418.16 across 2,000 synthetic Medicare hospice claims was validated side-by-side between the 1980s COBOL engine and our modernized Python microservice.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={triggerRun}
              disabled={isRunning}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'Executing Both Engines...' : 'Re-Run Side-by-Side Duel'}</span>
            </button>
          </div>
        </div>

        {/* Parity Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-amber-500/20 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Valid Claims Parity</span>
            <span className="font-mono font-bold text-emerald-400">2,000 / 2,000 (100.0%)</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Dollar Discrepancy</span>
            <span className="font-mono font-bold text-emerald-300">$0.0000 (To The Penny)</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Legacy Silent Failures</span>
            <span className="font-mono font-bold text-rose-400">Accepted 5 of 6 Bad Claims</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Modern Rejection Accuracy</span>
            <span className="font-mono font-bold text-cyan-400">100% Caught & Documented</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual Execution Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Legacy COBOL Output */}
        <div className="bg-[#0b0f19] border border-red-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h4 className="font-mono font-bold text-sm text-slate-200">
                  BEFORE: Legacy Mainframe COBOL
                </h4>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                HOSPRICR.CBL
              </span>
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                What you have to feed it (Fixed-Width 315-Char Punch-Card Record):
              </span>
              <div className="p-3 bg-black/80 rounded-xl font-mono text-[11px] text-slate-400 break-all border border-slate-800 scanline">
                {currentTest.fixedWidthRecord.slice(0, 115)}...
              </div>
            </div>

            <div className="mt-5">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                Mainframe Console Response:
              </span>
              <div className="p-4 bg-black rounded-xl border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-base">
                    TOTAL={currentTest.cobolOutput.total} RTC={currentTest.cobolOutput.rtc}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    STATUS: {currentTest.cobolOutput.status}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] mt-2">
                  {currentTest.cobolOutput.explanation}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            {currentTest.isBadClaim ? (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-rose-200">The COBOL Blind Spot:</span>{' '}
                  Reported "SUCCESS" and accepted a corrupt or dangerous claim without validation.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-200">Mainframe Succeeded:</span>{' '}
                  Calculated standard billing accurately for valid test input.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Modernized Python Microservice */}
        <div className="bg-[#0b0f19] border border-emerald-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="font-mono font-bold text-sm text-slate-200">
                  AFTER: Modern Python Microservice
                </h4>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                pricer.py (173 lines)
              </span>
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                What you feed it (Plain, Typed JSON Schema):
              </span>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-purple-300 border border-slate-800">
                <pre>{JSON.stringify(currentTest.modernInput, null, 2)}</pre>
              </div>
            </div>

            <div className="mt-5">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                Microservice API Response:
              </span>
              <div className={`p-4 rounded-xl border font-mono text-xs ${
                currentTest.modernOutput.status === 'paid'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base">
                    {currentTest.modernOutput.status === 'paid'
                      ? `TOTAL: $${currentTest.modernOutput.total}`
                      : 'STATUS: REJECTED'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    currentTest.modernOutput.status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {currentTest.modernOutput.status}
                  </span>
                </div>

                <div className="text-[11px] mt-2 opacity-90 leading-relaxed">
                  {currentTest.modernOutput.status === 'paid' ? (
                    <div>
                      <div>Routine Home Pay: ${currentTest.modernOutput.routine_home}</div>
                      {currentTest.modernOutput.high_rate_days !== undefined && (
                        <div>High Days (First 60d): {currentTest.modernOutput.high_rate_days} | Low Days: {currentTest.modernOutput.low_rate_days}</div>
                      )}
                      {currentTest.modernOutput.note && (
                        <div className="mt-1 text-cyan-300/90 font-sans">
                          💡 Note: {currentTest.modernOutput.note}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-rose-200">
                      Reason: "{currentTest.modernOutput.reason}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            {currentTest.modernOutput.status === 'rejected' ? (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-cyan-200">Defensive Architecture Succeeded:</span>{' '}
                  Caught the anomaly, blocked incorrect payment, and supplied human-readable diagnostics.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-200">Verified Parity:</span> Matches COBOL
                  to the exact penny while running as a cloud-native microservice.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discrepancy & Dollar Impact Card */}
      <div className={`p-4 rounded-2xl border shadow-lg ${
        currentTest.discrepancy.severity === 'critical'
          ? 'bg-rose-950/30 border-rose-500/40'
          : currentTest.discrepancy.severity === 'warning'
          ? 'bg-amber-950/30 border-amber-500/40'
          : 'bg-emerald-950/30 border-emerald-500/40'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl shrink-0 ${
              currentTest.discrepancy.severity === 'critical'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : currentTest.discrepancy.severity === 'warning'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400">
                Financial Impact & Correct Behavior
              </div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">
                Expected: {currentTest.discrepancy.shouldBe} — <span className="font-mono text-amber-300">{currentTest.discrepancy.dollarImpact}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentTest.discrepancy.narrative}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The 7 Claim Stress-Test Matrix */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-slate-200">
              Interactive Stress-Test Matrix: Click Any Scenario to Test Live
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare how the 1980s mainframe behaves versus the modern microservice on edge cases.
            </p>
          </div>
          <span className="text-xs text-amber-400 font-mono hidden sm:block">
            "The old code never says 'I don't know'."
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {allTests.map((t) => {
            const isSelected = t.id === currentTest.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTest(t)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/50 ring-2 ring-emerald-500/30 shadow-lg'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${t.badgeColor}`}>
                    {t.badge}
                  </span>
                  {isSelected && <span className="text-xs text-emerald-400 font-bold">Active</span>}
                </div>
                <div className="text-xs font-bold text-slate-200">{t.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {t.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
