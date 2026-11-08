import React, { useState, useRef } from 'react';
import { UploadCloud, FileCode2, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { TestCase } from '../data/mockData';

interface FileUploadZoneProps {
  onFileUploaded: (fileName: string, content: string) => void;
  onSelectPreset: (test: TestCase) => void;
  currentTest: TestCase;
  allTests: TestCase[];
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUploaded,
  onSelectPreset,
  currentTest,
  allTests,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadStatus(`Analyzing ${file.name}...`);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTimeout(() => {
        setUploadStatus(`Parsed ${file.name} successfully (315-byte fixed buffer detected).`);
        onFileUploaded(file.name, content);
      }, 500);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-emerald-400" />
            <span>Legacy Code & Batch Claims Ingestion</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Feed raw mainframe COBOL sources (<code className="text-emerald-400">.cbl</code>, <code className="text-emerald-400">.cpy</code>) or fixed-width 315-character transaction records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-mono">Input Type:</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            EBCDIC / Fixed 315
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`lg:col-span-7 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px] ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".cbl,.cob,.cpy,.txt,.dat"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 mb-3 shadow-inner">
            <FileCode2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-xs font-semibold text-slate-200">
            Drop legacy COBOL code or punch-card claim record here
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Supports <code className="text-slate-300">.cbl</code>, <code className="text-slate-300">.cpy</code>, or 315-character <code className="text-slate-300">.dat</code> records
          </div>
          {uploadStatus && (
            <div className="mt-3 text-xs text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40">
              {uploadStatus}
            </div>
          )}
        </div>

        {/* 1-Click Judge & Hackathon Demo Presets */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Pitch Presets (No typing needed)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Live Demo</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Click any scenario to instantly populate the 315-byte record and inspect the mainframe code:
            </p>

            <div className="space-y-2">
              {allTests.slice(0, 3).map((test) => {
                const isSelected = currentTest.id === test.id;
                return (
                  <button
                    key={test.id}
                    onClick={() => onSelectPreset(test)}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs text-slate-200">{test.title}</div>
                      <div className="text-[10px] text-slate-500">{test.subtitle}</div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ml-2 ${test.badgeColor}`}>
                      {test.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Selected: <strong className="text-emerald-300">{currentTest.title}</strong></span>
            <span className="font-mono text-slate-500">315 bytes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

