import React, { useState } from 'react';
import { PUNCH_CARD_FIELDS, PunchCardField, TestCase } from '../data/mockData';
import { HelpCircle, AlertTriangle, ArrowRightLeft, Sparkles, Check } from 'lucide-react';

interface PunchCardDecoderProps {
  currentTest: TestCase;
  onSelectTest: (test: TestCase) => void;
  allTests: TestCase[];
}

export const PunchCardDecoder: React.FC<PunchCardDecoderProps> = ({
  currentTest,
  onSelectTest,
  allTests,
}) => {
  const [activeField, setActiveField] = useState<PunchCardField | null>(PUNCH_CARD_FIELDS[0]);
  const [isShifted, setIsShifted] = useState<boolean>(false);

  const rawString = currentTest.fixedWidthRecord;
  const displayString = isShifted ? ' ' + rawString.slice(0, 314) : rawString;

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-semibold text-slate-100 font-mono">
              Mainframe Punch-Card Stream (315 Fixed-Width Bytes)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              EBCDIC / ASCII Buffer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Legacy COBOL has no JSON or field names. Every datum must land on an exact byte offset.
          </p>
        </div>

        {/* 1-Space Shift Simulation Switch */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsShifted(!isShifted)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
              isShifted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-900/30 shadow-lg'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>{isShifted ? 'Offset By 1 Space (Broken!)' : 'Simulate 1-Space Shift'}</span>
          </button>
        </div>
      </div>

      {/* Interactive 315-character byte visualizer strip */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
          <span>RAW BYTE STREAM [Pos 001 - 315]</span>
          <span className="text-amber-400/90 text-[11px]">
            Hover or click any segment below to inspect decoded mainframe variable
          </span>
        </div>

        {/* The visual byte stream box */}
        <div className="bg-[#070b13] border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto select-none scanline">
          <div className="flex flex-wrap gap-1 leading-relaxed items-center">
            {PUNCH_CARD_FIELDS.map((field) => {
              const startIdx = isShifted ? field.start + 1 : field.start;
              const endIdx = isShifted ? field.end + 1 : field.end;
              const segmentValue = displayString.slice(startIdx, endIdx);
              const isSelected = activeField?.id === field.id;

              return (
                <button
                  key={field.id}
                  onClick={() => setActiveField(field)}
                  onMouseEnter={() => setActiveField(field)}
                  className={`px-1.5 py-0.5 rounded text-left transition-all border ${
                    isSelected
                      ? 'ring-2 ring-emerald-400 bg-emerald-500/30 text-white font-bold scale-105 z-10'
                      : field.color
                  }`}
                  title={`${field.name} (${startIdx}-${endIdx}): ${segmentValue}`}
                >
                  <span className="opacity-60 text-[9px] block leading-none mb-0.5 font-sans">
                    {field.name}
                  </span>
                  <span>{segmentValue.replace(/ /g, '·')}</span>
                </button>
              );
            })}
            <span className="text-slate-600 px-1 py-0.5 font-mono text-[11px]">
              ... [211 trailing bytes: zero/space filler]
            </span>
          </div>
        </div>

        {/* Warning banner when shift simulation is activated */}
        {isShifted && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-rose-200">Mainframe Catastrophe Triggered:</span>{' '}
              Because the entire stream shifted 1 character right, COBOL now parses spaces into date variables
              and date digits into wage factors. The program throws <strong>no syntax error</strong>, compiles cleanly,
              and generates completely corrupted ledger entries!
            </div>
          </div>
        )}
      </div>

      {/* Selected Field Inspector Card */}
      {activeField && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Mainframe Field</div>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">{activeField.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{activeField.description}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Byte Range</div>
            <div className="text-xs font-mono text-slate-200 mt-0.5">
              Characters {activeField.start + 1} to {activeField.end} ({activeField.end - activeField.start} bytes)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Fixed offset required by compiler</div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Current Value</div>
            <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">
              "{displayString.slice(activeField.start, activeField.end).replace(/ /g, '·')}"
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {activeField.name === 'WAGE_INDEX' && '0.9747 Dallas Wage Factor (Implied 4 Decimals)'}
              {activeField.name === 'CLAIM_START' && 'March 1, 2020'}
              {activeField.name === 'ADMIT_DATE' && 'February 1, 2020 (30 days before care)'}
              {activeField.name === 'DAYS_UNITS' && '10 Days of Home Care'}
              {activeField.name === 'REV_CODE' && '0651: Routine Home Care'}
              {activeField.name === 'PATIENT_AREA' && 'CBSA 19124: Dallas, Texas'}
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Modernized Schema Equivalent</span>
            </div>
            <div className="text-xs font-mono text-slate-200 mt-1">
              {activeField.name === 'WAGE_INDEX' && '"patient_area": "19124" (Auto-looked up)'}
              {activeField.name === 'CLAIM_START' && '"service_date": "2020-03-01"'}
              {activeField.name === 'ADMIT_DATE' && '"admission_date": "2020-02-01"'}
              {activeField.name === 'DAYS_UNITS' && '"routine_home_days": 10'}
              {activeField.name === 'REV_CODE' && 'Mapped to typed claim method'}
              {activeField.name === 'PATIENT_AREA' && '"patient_area": "19124"'}
              {!['WAGE_INDEX', 'CLAIM_START', 'ADMIT_DATE', 'DAYS_UNITS', 'REV_CODE', 'PATIENT_AREA'].includes(activeField.name) &&
                'Managed automatically in payload'}
            </div>
          </div>
        </div>
      )}

      {/* Preset claim switcher chips */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs font-medium text-slate-300">
          Load Scenario:
        </div>
        <div className="flex flex-wrap gap-2">
          {allTests.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onSelectTest(t);
                setIsShifted(false);
              }}
              className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${
                currentTest.id === t.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm font-semibold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

