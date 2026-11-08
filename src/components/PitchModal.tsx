import React from 'react';
import { X, BookOpen, Quote, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0e1424] border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#0e1424]/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              Judges & Investor Pitch Cheat-Sheet (3-Minute Script)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-slate-300 text-xs leading-relaxed">
          {/* Golden Pitch Quote */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-slate-900 border border-emerald-500/30 p-4 rounded-xl flex items-start space-x-3">
            <Quote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                The Single Sentence to Deliver
              </div>
              <div className="text-sm font-semibold text-slate-100 mt-1 italic">
                "The old COBOL never says 'I don't know.' It always returns a check and a success code, even when the check is wrong by $132,000."
              </div>
            </div>
          </div>

          {/* 3-Minute Presentation Walkthrough */}
          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-3 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>3-Minute Stage Walkthrough</span>
            </h4>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px] font-bold">
                  <span>0:00 - 0:45 | The Hook: The $132k Silent Error</span>
                  <span className="text-slate-500">Screen 1 & 4</span>
                </div>
                <p className="mt-1.5 text-slate-300">
                  "Every day, billions of dollars in Medicare hospice claims flow through 1970s COBOL programs where developers have all retired. When a clerk mistypes Dallas's wage index as 99.9999, the mainframe cuts a $134,248 check instead of $1,911 and reports 'SUCCESS'. It never throws an exception."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-emerald-400 font-mono text-[11px] font-bold">
                  <span>0:45 - 1:30 | The Mainframe Punch-Card (Before)</span>
                  <span className="text-slate-500">Screen 1 (X-Ray)</span>
                </div>
                <p className="mt-1.5 text-slate-300">
                  "Look at how COBOL expects data: a 315-character fixed-width string. Shift one space, and the admission date becomes the wage factor. Our platform decompiles the punch card, labels every byte offset, and exposes 5,800 lines of procedural copybooks."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-purple-400 font-mono text-[11px] font-bold">
                  <span>1:30 - 2:15 | The Clean Microservice (After)</span>
                  <span className="text-slate-500">Screen 2 (Modernize)</span>
                </div>
                <p className="mt-1.5 text-slate-300">
                  "Our engine condenses 5,800 lines of spaghetti into 173 lines of self-documenting Python. We extract hardcoded rates into clean JSON tables so next fiscal year requires a config update, not a mainframe recompile. And we add defensive date validation."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-amber-400 font-mono text-[11px] font-bold">
                  <span>2:15 - 3:00 | The Mathematical Parity Proof</span>
                  <span className="text-slate-500">Screen 3 (Parity Duel)</span>
                </div>
                <p className="mt-1.5 text-slate-300">
                  "CMS spent years manually porting 10 Pricers to Java. We ran 2,000 real claims through both engines: 2,000 out of 2,000 matched to the penny ($1,874,418.16). And when we stress-tested the 6 claim traps that broke COBOL, our microservice stopped every single one."
                </p>
              </div>
            </div>
          </div>

          {/* Real Discovery Story (Judges love this) */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30">
            <h5 className="font-bold text-blue-300 text-xs flex items-center space-x-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>The 4-Decimal Rounding Discovery (Story for Q&A)</span>
            </h5>
            <p className="text-slate-300">
              "During verification, 6 of 500 crisis-care claims were off by exactly 1 penny. Our comparison engine pinpointed the cause: COBOL divides daily crisis care by 24 and truncates the hourly rate to 4 decimal places before multiplying. A naive AI rewrite misses this. Our platform preserved that quirk with a comment, guaranteeing absolute financial audit parity."
            </p>
          </div>

          {/* The CMS Comparison Talking Point */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h5 className="font-bold text-slate-200 text-xs mb-1">
              Why Not Just Write New Code From Scratch?
            </h5>
            <p className="text-slate-400">
              When CMS tried to modernize their payment systems, they spent years manually writing Java ports because legacy Medicare rules have hundreds of undocumented edge cases buried in copybooks. Our platform provides automated translation backed by mathematical proof against the official answer key.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0e1424] border-t border-slate-800 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
          >
            Close & Return to Live Demo
          </button>
        </div>
      </div>
    </div>
  );
};

