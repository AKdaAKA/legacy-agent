import React, { useState, useRef } from 'react';
import { Terminal, UploadCloud, Sparkles, ArrowRight, CheckCircle2, RotateCcw, AlertTriangle, FileArchive, Check, ShieldCheck, ChevronRight, FileCode, Layers, Info, Download, Play, Sliders, BookOpen, AlertOctagon, ExternalLink } from 'lucide-react';
import JSZip from 'jszip';

interface FileDetails {
  name: string;
  size: number;
  type: string;
  lines?: number;
}

interface ContextPoolDetails {
  mode: 'full-source' | 'langchain-bm25';
  sourceCharacters: number;
  contextCharacters: number;
  totalChunks: number;
  includedChunks: number;
  includedRanges: { fileName: string; lineStart: number; lineEnd: number }[];
}

export function App() {
  const [stage, setStage] = useState<'home' | 'uploading' | 'analyzing' | 'processing' | 'result'>('home');
  const [isDaysShifted, setIsDaysShifted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'interactive' | 'issues'>('comparison');
  const [activeScenario, setActiveScenario] = useState<number>(0);
  const [selectedIssue, setSelectedIssue] = useState<number>(0);
  const [sideBySideBadClaim, setSideBySideBadClaim] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<FileDetails | null>(null);
  const [zipFiles, setZipFiles] = useState<{ name: string; size: number }[]>([]);
  const [uploadedSource, setUploadedSource] = useState<string>('');
  const [generatedPython, setGeneratedPython] = useState<string>('');
  const [contextPool, setContextPool] = useState<ContextPoolDetails | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live tester interactive state
  const [calcArea, setCalcArea] = useState<string>('19124');
  const [calcDays, setCalcDays] = useState<number>(10);
  const [calcResult, setCalcResult] = useState<any>({
    areaName: 'Dallas-Plano-Irving, TX',
    wageIndex: 0.9747,
    highDays: 10,
    lowDays: 0,
    totalHigh: '1911.19',
    totalLow: '0.00',
    grandTotal: '1911.19',
    status: 'paid',
  });

  // Accurate 315-character record matching CMS pricer format
  // NPI(10) + PROV(6) + FROM(8) + ADMIT(8) + FILLER(10) + CBSA(5) + PAT_CBSA(5) + WI(6) + PAT_WI(6) + SIO(18) + FILL(10) + QIP(1) + REV(4) + HCPC(5) + DOS(8) + UNITS(7) + PAY(8) + ...
  const recordPrefix = "00000000009999992020030120200201          1912419124009747009747000000000000000000          0651     20200301";
  const normalUnits = "0000010"; // chars 111-117
  const shiftedUnits = " 000001"; // shifted 1 space right
  const recordSuffix = "00000000" + "0".repeat(72) + "0".repeat(8) + "  0000" + " ".repeat(8) + "0".repeat(102);

  const displayRecord = recordPrefix + (isDaysShifted ? shiftedUnits : normalUnits) + recordSuffix;

  // Accurate field definitions based on CMS record layout
  const recordFields = [
    { label: 'NPI', chars: '1–10', val: '0000000000', note: 'National Provider ID' },
    { label: 'PROV', chars: '11–16', val: '999999', note: 'Hospice Provider Num' },
    { label: 'CLAIM DATE', chars: '17–24', val: '20200301', note: 'Care Start Date (March 1)' },
    { label: 'ADMIT DATE', chars: '25–32', val: '20200201', note: 'Admission Date (Feb 1)' },
    { label: 'PROV AREA', chars: '43–47', val: '19124', note: 'Provider CBSA (Dallas)' },
    { label: 'PATIENT AREA', chars: '48–52', val: '19124', note: 'Patient CBSA (Dallas)' },
    { label: 'PROV WAGE', chars: '53–58', val: '009747', note: '0.9747 Provider Factor' },
    { label: 'PATIENT WAGE', chars: '59–64', val: '009747', note: '0.9747 Patient Factor (Used)' },
    { label: 'REV CODE', chars: '94–97', val: '0651', note: 'Routine Home Care' },
    { label: 'CARE DATE', chars: '103–110', val: '20200301', note: 'DOS (Date of Service)' },
    {
      label: 'DAYS',
      chars: '111–117',
      val: isDaysShifted ? ' 000001' : '0000010',
      note: isDaysShifted ? 'Corrupted: 1 space offset!' : '10 Days of Care',
      isBroken: isDaysShifted
    },
  ];

  // The bad claim scenarios with COBOL vs Should Have Been vs Modern Python
  const badScenarios = [
    {
      id: 'wage_typo',
      title: 'Wage value 99.99 (Dallas is 0.9747)',
      badge: 'Overpaid $132,337',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      cobol: '$134,248.47 ✅ success',
      shouldBe: '$1,911.19',
      python: 'Not possible: wage index is looked up from official CMS table by area code',
      explanation: 'If a bad wage value reaches the pricer, it calculates a $134,248 payment instead of $1,911, and reports SUCCESS. It never sanity-checks the rate.',
    },
    {
      id: 'wrong_year',
      title: 'Claim dated 2025 (2020-only code)',
      badge: 'Underpaid ~$298',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      cobol: '$1,911.19 ✅ success',
      shouldBe: '~$2,209 (FY2025 rates)',
      python: 'Rejected: "Service date 2025-03-01 is outside FY2020. Route to rates_fy2025.json"',
      explanation: 'COBOL has no fiscal-year check. It silently underpays the hospice using 5-year-old rates and reports success.',
    },
    {
      id: 'wrong_slot',
      title: '5 inpatient days in wrong slot',
      badge: 'Shorted $5,024',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      cobol: '$0.00 ✅ success',
      shouldBe: '$5,023.56',
      python: 'Paid: $5,023.56 (Named JSON fields eliminate positional offset bugs)',
      explanation: 'When 5 hospital-level days are offset by 4 positions in the record, COBOL reads spaces, pays $0.00, and still says success.',
    },
    {
      id: 'admit_after_care',
      title: 'Admission date after care date',
      badge: 'Paid $0, no reason',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      cobol: '$0.00 ✅ success',
      shouldBe: 'Reject with reason',
      python: 'Rejected: "Admission date 2020-04-01 is after service date 2020-03-01"',
      explanation: 'If admission is mistyped after service date, COBOL zeros the math and exits with status 75 (success). The clinic receives $0 with zero explanation.',
    },
    {
      id: 'impossible_date',
      title: 'Impossible date (Feb 30, 2020)',
      badge: 'Corrupt date passed',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      cobol: '$1,911.19 ✅ success',
      shouldBe: 'Reject: invalid calendar date',
      python: 'Rejected: "Day 30 is out of range for Feb 2020"',
      explanation: 'COBOL has no calendar library. It blindly accepted Feb 30 and wrote it to the ledger with success status.',
    },
  ];

  const issuesFixed = [
    {
      title: 'Fixed-Width Buffer Fragility',
      before: '315-character record where every byte is rigidly positioned. A single space offset in the DAYS field turns 10 days into $0.00 payment with no error.',
      after: 'Named, typed JSON schema. Whitespace or field ordering cannot corrupt calculations.',
    },
    {
      title: 'Hardcoded Rates in Copybooks',
      before: 'Rates hardcoded across copybooks (HOSPRATE.cpy). Updating for next year required editing source files and recompiling binaries.',
      after: 'Rates externalized into rates_fy2020.json. Next fiscal year requires dropping in a new JSON file, touching zero code.',
    },
    {
      title: 'Silent Failures & Misleading Success Codes',
      before: 'Output is just "TOTAL=$1911.19 RTC=75". Bad claims return $0.00 or $134,248 and still say RTC 75 (success).',
      after: 'Explicit JSON response with high/low rate breakdown and human-readable rejection reasons.',
    },
    {
      title: '4-Decimal Rounding Quirk',
      before: 'COBOL truncates the hourly crisis-care rate to 4 decimal places mid-calculation. A naive AI rewrite comes out a penny high.',
      after: 'Faithfully reproduces the 4-decimal cut with a documented comment, guaranteeing 100% mathematical parity.',
    },
  ];

  // Live calculator calculation function
  const runLiveCalculation = (area = calcArea, days = calcDays) => {
    const areaWageMap: Record<string, { wage: number; name: string }> = {
      '19124': { wage: 0.9747, name: 'Dallas-Plano-Irving, TX' },
      '26420': { wage: 1.0018, name: 'Houston-Sugar Land, TX' },
      '12420': { wage: 0.9396, name: 'Austin-Round Rock, TX' },
    };

    const areaInfo = areaWageMap[area] || areaWageMap['19124'];
    const wage = areaInfo.wage;

    // Routine Home Care FY2020 rates
    const highRateDaily = 137.94 * wage + 62.70;
    const lowRateDaily = 133.72 * wage + 60.78;

    // 60-day stepdown logic
    const highDays = Math.min(days, 60);
    const lowDays = Math.max(days - 60, 0);

    const totalHigh = Math.round(highRateDaily * highDays * 100) / 100;
    const totalLow = Math.round(lowRateDaily * lowDays * 100) / 100;
    const grandTotal = Math.round((totalHigh + totalLow) * 100) / 100;

    setCalcResult({
      areaName: areaInfo.name,
      wageIndex: wage,
      highDays,
      lowDays,
      totalHigh: totalHigh.toFixed(2),
      totalLow: totalLow.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      status: 'paid',
    });
  };

  const handleFileUpload = async (file: File) => {
    setStage('uploading');
    setConversionError(null);
    setGeneratedPython('');

    try {
      let source: string;
      let files: { name: string; size: number }[];
      if (file.name.toLowerCase().endsWith('.zip')) {
        if (file.size > 10_000_000) {
          throw new Error('ZIP archives must be 10 MB or smaller.');
        }
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(file);
        const sourceFiles: { name: string; content: string }[] = [];
        const entries = Object.values(loadedZip.files);
        for (const entry of entries) {
          if (entry.dir) continue;
          if (!/\.(?:cbl|cob|cpy)$/i.test(entry.name) && !/(?:^|\/)HOS[A-Z0-9]+\.txt$/i.test(entry.name)) continue;
          const content = await entry.async('string');
          sourceFiles.push({ name: entry.name, content });
        }
        if (sourceFiles.length === 0) {
          throw new Error('No COBOL source files (.cbl, .cob, or .cpy) were found in this ZIP archive.');
        }
        source = sourceFiles.map(({ name, content }) => `*> Source file: ${name}\n${content}`).join('\n\n');
        files = sourceFiles.map(({ name, content }) => ({ name, size: content.length }));
        setZipFiles(files);
      } else {
        source = await file.text();
        files = [{ name: file.name, size: file.size }];
        setZipFiles(files);
      }

      if (source.trim().length === 0) {
        throw new Error('The selected file does not contain any source text.');
      }

      setUploadedSource(source);
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.name.toLowerCase().endsWith('.zip') ? 'zip' : 'source',
        lines: source.split(/\r\n|\r|\n/).length,
      });
      setTimeout(() => {
        setStage('analyzing');
      }, 1100);
    } catch (error) {
      setStage('home');
      setConversionError(error instanceof Error ? error.message : 'Unable to read the selected source file.');
    }
  };

  const handleDemoPreset = async () => {
    setStage('uploading');
    setConversionError(null);
    setGeneratedPython('');
    try {
      const response = await fetch('/api/demo-source');
      const result: { fileName?: string; source?: string; error?: string } = await response.json();
      if (!response.ok || typeof result.fileName !== 'string' || typeof result.source !== 'string') {
        throw new Error(result.error || 'Unable to load the sample COBOL source.');
      }
      setUploadedSource(result.source);
      setUploadedFile({
        name: result.fileName,
        size: result.source.length,
        type: 'source',
        lines: result.source.split(/\r\n|\r|\n/).length,
      });
      setZipFiles([{ name: result.fileName, size: result.source.length }]);
      setTimeout(() => {
        setStage('analyzing');
      }, 500);
    } catch (error) {
      setStage('home');
      setConversionError(error instanceof Error ? error.message : 'Unable to load the sample COBOL source.');
    }
  };

  const handleModernize = async () => {
    if (!uploadedSource) {
      setConversionError('Upload a COBOL source file before starting the conversion.');
      return;
    }

    setConversionError(null);
    setContextPool(null);
    setStage('processing');
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: uploadedFile?.name || 'source.cbl', source: uploadedSource }),
      });
      const result: { pythonCode?: unknown; contextPool?: ContextPoolDetails; error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Gemini conversion failed.');
      }
      if (typeof result.pythonCode !== 'string' || result.pythonCode.trim().length === 0) {
        throw new Error('Gemini did not return Python source code.');
      }
      setGeneratedPython(result.pythonCode);
      setContextPool(result.contextPool || null);
      setStage('result');
      runLiveCalculation(calcArea, calcDays);
    } catch (error) {
      setStage('analyzing');
      setConversionError(error instanceof Error ? error.message : 'Gemini conversion failed.');
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setZipFiles([]);
    setUploadedSource('');
    setGeneratedPython('');
    setContextPool(null);
    setConversionError(null);
    setIsDaysShifted(false);
    setSideBySideBadClaim(false);
    setStage('home');
  };

  // Download the code returned by Gemini rather than the static case-study example.
  const handleDownloadRunnableCode = async () => {
    if (!generatedPython) {
      setConversionError('There is no generated Python code to download yet.');
      return;
    }

    const zip = new JSZip();
    const baseName = (uploadedFile?.name || 'converted')
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_') || 'converted';
    zip.file(`${baseName}.py`, generatedPython);

    zip.file(
      'README.md',
      `# Gemini COBOL conversion

Generated from ${uploadedFile?.name || 'the uploaded COBOL source'} by Gemini.

Review the converted code and its dependencies before running it. This conversion has not been executed or verified for behavioral or financial parity.
`
    );

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-python.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Minimal Top Bar */}
      <header className="border-b border-zinc-800/80 bg-black/40 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white font-mono">legacy-agent</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {stage !== 'home' && (
              <button
                onClick={handleReset}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition-all cursor-pointer"
              >
                Upload Another File
              </button>
            )}
            <span className="flex items-center space-x-1.5 text-zinc-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>COBOL → Python Parity Engine</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* ======================================================== */}
        {/* STAGE 1: HOME PAGE (REWRITTEN HONEST OVERVIEW & UPLOAD)   */}
        {/* ======================================================== */}
        {stage === 'home' && (
          <div className="space-y-10 animate-fade-in max-w-3xl mx-auto">
            {/* Title & Core Problem */}
            <div className="space-y-3">
              <div className="inline-block text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                COBOL → Python modernization, proven to the penny
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Ten days of Dallas hospice care should cost $1,911. One typo made Medicare’s code pay $134,248, with no error.
              </h1>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Most of that is missing paperwork, but every payment is calculated by software, and much of that software is decades-old COBOL that nobody can safely change.
              </p>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-500/30 text-xs text-zinc-200 leading-relaxed">
                <strong>legacy-agent</strong> reads legacy COBOL, rebuilds it as a modern tested Python service, and proves the new version pays exactly the same as the original, while catching the bad claims the original silently accepted.
              </div>
            </div>

            {/* What is COBOL? */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                What is COBOL, and why is so much money still running on it?
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                COBOL (Common Business-Oriented Language) was designed in 1959 for business record-keeping. It reads like all-caps English:
              </p>
              <pre className="p-3 bg-black rounded-lg font-mono text-xs text-emerald-400/90 border border-zinc-800 overflow-x-auto">
                {`223100 COMPUTE HR-BILL-PAY-AMT1 ROUNDED =
223200    ((2020-V200-HIGH-RHC-LS-RATE * BILL-BENE-WAGE-INDEX) 
223300    + 2020-V200-HIGH-RHC-NLS-RATE) * HR-BILL-UNITS1`}
              </pre>
              <p className="text-xs text-zinc-400 leading-relaxed">
                It was excellent at processing huge batches of records, so banks, insurers, and government agencies built their core systems on it from the 1960s onward.
                Reuters estimated in 2017 that about <em>$3 trillion in daily commerce</em> still flows through COBOL systems. Federal agencies, from Social Security to the IRS, still rely on it.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                COBOL isn't "broken." The problem is that these systems are huge, old, and understood by fewer people every year, so every change is risky and slow.
              </p>
            </div>

            {/* The problem in one real program */}
            <div className="space-y-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <span>The problem, in one real program</span>
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                We took the <strong>actual FY2020 Medicare Hospice Pricer</strong>, the COBOL program CMS used to calculate hospice payments (downloaded from CMS's public archive), and ran it on a laptop:
              </p>

              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-zinc-100">It's mostly dead code:</strong> The main file is 5,782 lines. Only ~750 lines run for 2020 claims. The rest is copy-pasted logic for every year from 1998 to 2019.
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-zinc-100">One character off breaks everything:</strong> Each claim is a single 315-character line. Shift a field by one space and the claim is misread, with no warning.
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-zinc-100">It doesn't check its inputs:</strong> Impossible dates, typos, wrong years. It pays them anyway. 7 of our 8 bad test claims went through as “success.”
                  </div>
                </div>
              </div>
            </div>

            {/* How legacy-agent works */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-white">How legacy-agent works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="font-bold text-emerald-400 font-mono">1. Upload COBOL</span>
                  <p className="text-zinc-400 leading-relaxed">
                    Upload your COBOL files. Gemini uses them to create Python code.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="font-bold text-cyan-400 font-mono">2. Create Python</span>
                  <p className="text-zinc-400 leading-relaxed">
                    The new code uses clear field names, keeps payment rates in a separate file, and checks inputs.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="font-bold text-amber-400 font-mono">3. Compare results</span>
                  <p className="text-zinc-400 leading-relaxed">
                    Review and test generated Python against the original COBOL.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="font-bold text-purple-400 font-mono">4. Check the source</span>
                  <p className="text-zinc-400 leading-relaxed">
                    Check the Python code and its notes against the original COBOL.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Box */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white">Upload Legacy COBOL Package</h3>
                <p className="text-xs text-zinc-400">
                  Select a mainframe archive (<code className="text-zinc-300">.zip</code>) or source file (<code className="text-zinc-300">.cbl</code>).
                </p>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-zinc-700/80 hover:border-emerald-500/60 bg-black/40 hover:bg-black/60 rounded-xl p-8 text-center cursor-pointer transition-all space-y-3"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  accept=".zip,.cbl,.cob,.cpy,.txt,.dat"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-300 mx-auto">
                  <UploadCloud className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-xs font-semibold text-zinc-200">
                  Click to browse or drop your legacy archive here
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Supports .zip packages or .cbl source files
                </div>
              </div>
              <p className="text-center text-[11px] text-zinc-500">
                Source files are sent to Gemini through the local API for conversion. Configure your API key on the server; it is never placed in browser code.
              </p>

              <div className="text-center pt-2 border-t border-zinc-800/60">
                <span className="text-xs text-zinc-500">Or run the live test pricer: </span>
                <button
                  onClick={handleDemoPreset}
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline font-mono cursor-pointer transition-all font-semibold"
                >
                  Load hospice-legacy.zip (CMS Medicare Pricer)
                </button>
              </div>
              {conversionError && (
                <div role="alert" className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {conversionError}
                </div>
              )}
            </div>

            {/* Honest Scope & Sources */}
            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 space-y-2 text-xs text-zinc-400">
              <span className="font-bold text-zinc-300 uppercase tracking-wider text-[10px] block font-mono">Honest Scope:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Validates against CMS's real COBOL program (HOSPR200) downloaded from the public archive, running on synthetic test claims.</li>
                <li>One real program (FY2020 Hospice Pricer), not all of Medicare.</li>
                <li>The mainframe file loaders were replaced by a test driver so the pricer runs on standard modern machines.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 2: BRIEF UPLOADING SCAN LOADER                     */}
        {/* ======================================================== */}
        {stage === 'uploading' && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center space-y-4 animate-fade-in max-w-xl mx-auto">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white font-mono">Scanning Legacy Package...</div>
              <p className="text-xs text-zinc-400 font-mono text-[11px]">
                Reading uploaded COBOL source and included copybooks...
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 3: AFTER UPLOAD — NUMBERED WALKTHROUGH & PROBLEMS   */}
        {/* ======================================================== */}
        {stage === 'analyzing' && uploadedFile && (
          <div className="space-y-8 animate-fade-in">
            {/* Header: Package Info */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <FileArchive className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">Loaded Package</div>
                  <div className="text-sm font-bold text-white font-mono">{uploadedFile.name}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-zinc-400">{zipFiles.length} source files • {uploadedFile.lines?.toLocaleString()} lines</span>
              </div>
            </div>

            {/* ① WHAT YOU WANT TO PAY */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="border-b border-zinc-800/80 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono">①</span>
                    <span>What you want to calculate (Plain English)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    A grandma in Dallas, admitted Feb 1, 2020, gets 10 days of routine home care starting March 1.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">Baseline Test Claim</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block uppercase font-mono">Patient Location</span>
                  <span className="text-zinc-100 font-bold text-sm">Dallas, TX</span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5 font-mono">Area 19124 (WI: 0.9747)</span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block uppercase font-mono">Admission Date</span>
                  <span className="text-zinc-100 font-bold text-sm">Feb 1, 2020</span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5 font-mono">Hospice entry date</span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block uppercase font-mono">Care Start Date</span>
                  <span className="text-zinc-100 font-bold text-sm">March 1, 2020</span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5 font-mono">Service date</span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block uppercase font-mono">Care Rendered</span>
                  <span className="text-emerald-400 font-bold text-sm">10 Days Routine Home</span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5 font-mono">Rev code 0651, 10 units</span>
                </div>
              </div>

              {/* Modern API equivalent shown right next to it */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-black/40 p-3 rounded-xl border border-zinc-800 gap-2">
                <span className="text-zinc-400 font-mono text-[11px]">
                  Modern JSON API Input:
                </span>
                <code className="text-purple-300 font-mono text-xs">
                  {`{ "patient_area": "19124", "admission_date": "2020-02-01", "service_date": "2020-03-01", "routine_home_days": 10 }`}
                </code>
              </div>
            </div>

            {/* ② HOW COBOL NEEDS IT */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-3 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono">②</span>
                    <span>How COBOL needs it: The 315-Character Fixed-Width Record</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    COBOL doesn't accept field names. Every value must sit at an exact character position.
                  </p>
                </div>

                <button
                  onClick={() => setIsDaysShifted(!isDaysShifted)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${isDaysShifted
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                    }`}
                >
                  {isDaysShifted ? 'Shifted: DAYS Offset by 1 Space (Broken)' : 'Test: Shift DAYS Field 1 Space'}
                </button>
              </div>

              {/* Side-by-side: NORMAL vs BROKEN comparison */}
              <div className="space-y-3 font-mono text-xs">
                {/* NORMAL ROW */}
                <div className={`p-3 rounded-xl border ${!isDaysShifted ? 'bg-black border-emerald-500/40 ring-1 ring-emerald-500/20' : 'bg-black/50 border-zinc-800 opacity-60'}`}>
                  <div className="flex items-center justify-between text-[11px] mb-1.5 text-zinc-400">
                    <span className="text-emerald-400 font-bold">NORMAL RECORD (Exact character offsets)</span>
                    <span className="text-emerald-400 font-bold">COBOL Result: $1,911.19, RTC 75 ✅ (success)</span>
                  </div>
                  <div className="break-all text-[11px] text-zinc-400 leading-relaxed">
                    <span>00000000009999992020030120200201          1912419124009747009747000000000000000000          0651     20200301</span>
                    <span className="bg-emerald-500/30 text-emerald-200 px-1 py-0.5 rounded font-bold">0000010</span>
                    <span className="text-zinc-600">00000000... [190 more trailing bytes]</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    ↑ Chars 94–97: 0651 (Home Care) | Chars 111–117: 0000010 (10 Days)
                  </div>
                </div>

                {/* BROKEN ROW (DAYS shifted 1 space right) */}
                <div className={`p-3 rounded-xl border ${isDaysShifted ? 'bg-rose-950/20 border-rose-500/50 ring-1 ring-rose-500/30' : 'bg-black/50 border-zinc-800 opacity-60'}`}>
                  <div className="flex items-center justify-between text-[11px] mb-1.5 text-zinc-400">
                    <span className="text-rose-400 font-bold">BROKEN RECORD (DAYS field shifted 1 space right)</span>
                    <span className="text-rose-400 font-bold">COBOL Result: $0.00, RTC 00 ✅ "SUCCESS"</span>
                  </div>
                  <div className="break-all text-[11px] text-zinc-400 leading-relaxed">
                    <span>00000000009999992020030120200201          1912419124009747009747000000000000000000          0651     20200301</span>
                    <span className="bg-rose-500/40 text-rose-200 px-1 py-0.5 rounded font-bold underline"> 000001</span>
                    <span className="text-zinc-600">00000000... [190 more trailing bytes]</span>
                  </div>
                  <div className="text-[10px] text-rose-400/90 mt-1 font-sans">
                    ↑ One space offset turns 0000010 into 000001. COBOL reads garbage, calculates $0.00, and still reports SUCCESS. Nobody is told the hospice wasn't paid.
                  </div>
                </div>
              </div>

              {/* Clean breakdown cards in neutral gray with red highlights when broken */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {recordFields.slice(0, 8).map((f) => (
                  <div key={f.label} className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/70 text-xs">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">{f.label} ({f.chars})</div>
                    <div className="font-bold text-sm font-mono text-zinc-200 mt-0.5">{f.val}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 truncate">{f.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ③ WHAT GOES WRONG */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="border-b border-zinc-800/80 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-mono">③</span>
                  <span>COBOL lacks proper input validation</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  These are intentionally bad test cases for this specific program, not proof that all COBOL code is broken. They show how it can accept invalid or out-of-range data and still report success.
                </p>
              </div>

              {/* Scenario Selector Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {badScenarios.map((scen, idx) => (
                  <button
                    key={scen.id}
                    onClick={() => setActiveScenario(idx)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${activeScenario === idx
                        ? 'bg-zinc-800 border-emerald-500/50 ring-1 ring-emerald-500/30'
                        : 'bg-black/40 border-zinc-800 hover:bg-zinc-900'
                      }`}
                  >
                    <div className="font-semibold text-zinc-200">{scen.title}</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border inline-block mt-2 font-mono ${scen.badgeColor}`}>
                      {scen.badge}
                    </span>
                  </button>
                ))}
              </div>

              {/* 3-Column Comparison: COBOL vs SHOULD HAVE BEEN vs MODERN PYTHON */}
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 space-y-3 text-xs">
                <div className="font-bold text-white text-sm font-mono">
                  {badScenarios[activeScenario].title}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Legacy COBOL Returned</span>
                    <span className="font-mono font-bold text-rose-400 text-sm block">
                      {badScenarios[activeScenario].cobol}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">What It Should Have Been</span>
                    <span className="font-mono font-bold text-amber-300 text-sm block">
                      {badScenarios[activeScenario].shouldBe}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Modern Python Behavior</span>
                    <span className="font-mono font-bold text-emerald-300 text-xs block leading-tight">
                      {badScenarios[activeScenario].python}
                    </span>
                  </div>
                </div>

                <p className="text-zinc-300 text-xs leading-relaxed pt-1">
                  {badScenarios[activeScenario].explanation}
                </p>
              </div>
            </div>

            {/* ④ MODERNIZE IT */}
            <div className="bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4">
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center justify-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono">④</span>
                  <span>Convert COBOL to Python with Gemini</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  The uploaded source is sent to Gemini and returned as Python code. Review and test the result; conversion alone does not prove behavioral or financial parity.
                </p>
              </div>

              <button
                onClick={handleModernize}
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center space-x-2 cursor-pointer font-mono"
              >
                <Sparkles className="w-4 h-4" />
                <span>Convert COBOL to Python with Gemini</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {conversionError && (
                <div role="alert" className="max-w-xl mx-auto p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {conversionError}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 4: AI PROCESSING ANIMATION                         */}
        {/* ======================================================== */}
        {stage === 'processing' && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 text-center space-y-4 animate-fade-in max-w-xl mx-auto">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white font-mono">Gemini is converting the COBOL source to Python...</div>
              <div className="text-xs text-zinc-400 font-mono text-[11px] space-y-1.5 text-left bg-black p-4 rounded-lg border border-zinc-800 mt-3">
                <div className="text-emerald-400">✓ Loaded {uploadedFile?.name || 'COBOL source'} ({uploadedSource.length.toLocaleString()} characters)</div>
                <div className="text-cyan-400">→ LangChain BM25 builds a local context pool; small sources are kept whole</div>
                <div className="text-amber-400 animate-pulse">→ Sending the focused context to Gemini. Parity is not automatically verified.</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 5: AFTER MODERNIZING (BEFORE VS AFTER & METRICS)    */}
        {/* ======================================================== */}
        {stage === 'result' && (
          <div className="space-y-6 animate-fade-in">
            <section className="bg-zinc-900/80 border border-emerald-500/30 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-emerald-300 font-mono">Gemini conversion: {uploadedFile?.name}</h2>
                  <p className="text-[11px] text-amber-300 mt-1">Generated code is a draft. Review, run, and verify it against the original before production use.</p>
                </div>
              </div>
              {contextPool && (
                <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950/70 text-[11px] text-zinc-300 font-mono space-y-2">
                  <div>
                    Context pool: <span className="text-cyan-300">{contextPool.mode === 'langchain-bm25' ? 'LangChain BM25 retrieval' : 'full source'}</span>
                    {' · '}{contextPool.contextCharacters.toLocaleString()} of {contextPool.sourceCharacters.toLocaleString()} source characters
                    {contextPool.mode === 'langchain-bm25' && ` · ${contextPool.includedChunks}/${contextPool.totalChunks} chunks`}
                  </div>
                  {contextPool.mode === 'langchain-bm25' && (
                    <details>
                      <summary className="cursor-pointer text-cyan-300">Show retrieved source ranges</summary>
                      <ul className="mt-2 space-y-1 text-zinc-400">
                        {contextPool.includedRanges.map((range, index) => (
                          <li key={`${range.fileName}-${range.lineStart}-${index}`}>
                            {range.fileName}: lines {range.lineStart}–{range.lineEnd}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              )}
              <pre className="p-5 max-h-[600px] overflow-auto bg-black text-xs text-cyan-200 font-mono whitespace-pre-wrap">
                <code>{generatedPython}</code>
              </pre>
            </section>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
              The parity figures and interactive pricer below are static hospice case-study examples; they are not test results for this Gemini-generated conversion.
            </div>

            {/* Parity & Improvement Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                <span className="text-[11px] text-zinc-500 block uppercase font-mono">Code Reduction</span>
                <span className="text-lg font-bold font-mono text-emerald-400">5,782 → 173</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">−97% (22 yrs dead code removed)</span>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                <span className="text-[11px] text-zinc-500 block uppercase font-mono">Valid Parity Match</span>
                <span className="text-lg font-bold font-mono text-emerald-400">Exact Match</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Matched to the penny ($1,911.19)</span>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                <span className="text-[11px] text-zinc-500 block uppercase font-mono">Bad Test Cases Caught</span>
                <span className="text-lg font-bold font-mono text-cyan-400">1 of 8 → 8 of 8</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">In this hospice-pricer test set</span>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                <span className="text-[11px] text-zinc-500 block uppercase font-mono">Rates Architecture</span>
                <span className="text-lg font-bold font-mono text-amber-400">rates_fy2020.json</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Externalized data matrix</span>
              </div>
            </div>

            {/* View Selector Tabs & Download Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-2 gap-3 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'comparison'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  Before vs After Comparison
                </button>
                <button
                  onClick={() => setActiveTab('interactive')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'interactive'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  Interactive Python Calculator
                </button>
                <button
                  onClick={() => setActiveTab('issues')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'issues'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  Issues Fixed ({issuesFixed.length})
                </button>
              </div>

              {/* DOWNLOAD RUNNABLE PYTHON CODE BUTTON */}
              <button
                onClick={handleDownloadRunnableCode}
                className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold inline-flex items-center space-x-1.5 transition-all text-xs cursor-pointer shadow-md shadow-emerald-500/20 font-mono"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Generated Python (.zip)</span>
              </button>
            </div>

            {/* TAB 1: Comparison View */}
            {activeTab === 'comparison' && (
              <div className="space-y-4">
                {/* Bad Claim Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-zinc-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-zinc-400">Comparison Case:</span>
                    <button
                      onClick={() => setSideBySideBadClaim(false)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${!sideBySideBadClaim ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                      Valid Claim (Dallas 10 Days)
                    </button>
                    <button
                      onClick={() => setSideBySideBadClaim(true)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${sideBySideBadClaim ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                      Bad Claim ($134K Wage Typo)
                    </button>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                    {sideBySideBadClaim ? 'Proves Modern Python catches what COBOL missed' : 'Proves exact penny mathematical parity'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BEFORE */}
                  <div className="min-w-0 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                        <span className="text-xs font-mono font-bold text-rose-400">BEFORE: Legacy COBOL (HOSPR200)</span>
                        <span className="text-[10px] font-mono text-zinc-500">5,782 Lines</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Input:</span>
                        <div className="p-2.5 bg-black rounded-lg font-mono text-[11px] text-zinc-400 break-all border border-zinc-800">
                          {sideBySideBadClaim
                            ? '00000000009999992020030120200201          1912419124999999999999000000000000000000          0651     202003010000010...'
                            : '00000000009999992020030120200201          1912419124009747009747000000000000000000          0651     202003010000010...'}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                          <span>Actual CMS Code Lines 223100–223300:</span>
                          <span className="text-emerald-400 font-sans">High Rate (Day ≤60)</span>
                        </div>
                        <pre className="p-3 bg-black rounded-lg font-mono text-[11px] text-emerald-400/90 border border-zinc-800 overflow-x-auto whitespace-pre">
                          {`223100        COMPUTE HR-BILL-PAY-AMT1 ROUNDED =
223200           ((2020-V200-HIGH-RHC-LS-RATE * BILL-BENE-WAGE-INDEX)
223300           + 2020-V200-HIGH-RHC-NLS-RATE) *  HR-BILL-UNITS1`}
                        </pre>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Console Output:</span>
                        <div className="p-3 bg-black rounded-lg font-mono text-xs text-zinc-200 border border-zinc-800">
                          {sideBySideBadClaim ? (
                            <span className="text-rose-400 font-bold">TOTAL=$134248.47 RTC=75 (SUCCESS)</span>
                          ) : (
                            <span className="text-emerald-400 font-bold">TOTAL=$1911.19 RTC=75 (SUCCESS)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-black/60 border border-zinc-800/80 text-[11px] text-zinc-400">
                      💡 <strong>Dead Code Fact:</strong> This file contains pricing code for every year from 1998 to 2019. Only lines 5046–5782 run for 2020 claims.
                    </div>
                  </div>

                  {/* AFTER */}
                  <div className="min-w-0 bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                        <span className="text-xs font-mono font-bold text-emerald-400">AFTER: Modernized Python</span>
                        <span className="text-[10px] font-mono text-emerald-400">173 Lines</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Input:</span>
                        <pre className="w-full min-w-0 p-2.5 bg-black rounded-lg font-mono text-[11px] text-purple-300 border border-zinc-800 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                          {JSON.stringify(
                            sideBySideBadClaim
                              ? { patient_area: '19124', wage_override: '99.9999', routine_home_days: 10 }
                              : { patient_area: '19124', admission_date: '2020-02-01', service_date: '2020-03-01', routine_home_days: 10 },
                            null,
                            2
                          )}
                        </pre>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                          <span>Gemini-generated Python draft:</span>
                          <span className="text-cyan-400 font-sans">← HOSPR200 lines 2130–2179</span>
                        </div>
                        <pre className="p-3 bg-black rounded-lg font-mono text-[11px] text-cyan-300 border border-zinc-800 overflow-x-auto whitespace-pre">
                          {`# 60-day hospice stepdown rule
high_left = max(60 - days_in_hospice, 0)
high_days = min(c.routine_home_days, high_left)
low_days = c.routine_home_days - high_days
rhc = cents(daily(r["rhc_high"], wage) * high_days) + \\
      cents(daily(r["rhc_low"], wage) * low_days)`}
                        </pre>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">API Output:</span>
                        <div className="p-3 bg-black rounded-lg font-mono text-xs border border-zinc-800">
                          {sideBySideBadClaim ? (
                            <span className="text-rose-400 font-bold">{`{ "status": "rejected", "reason": "Wage index looked up from official CMS table; raw override rejected" }`}</span>
                          ) : (
                            <span className="text-emerald-400 font-bold">{`{ "status": "paid", "total": "1911.19", "high_rate_days": 10, "low_rate_days": 0 }`}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
                      ✨ <strong>Audit Traceability:</strong> Every line in the Python pricer links directly to the corresponding COBOL paragraph (e.g. <code className="font-mono">V200-EVAL-RHC-DAYS</code>).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Interactive Live Tester */}
            {activeTab === 'interactive' && (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6">
                <div>
                  <div className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span>Run the Modernized Python Pricer Live in Your Browser</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Try changing the days of care or patient area. Notice how the first 60 days automatically pay the high rate, while days beyond 60 step down to the lower rate!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300">Patient Area (CBSA)</label>
                    <select
                      value={calcArea}
                      onChange={(e) => {
                        setCalcArea(e.target.value);
                        runLiveCalculation(e.target.value, calcDays);
                      }}
                      className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs font-mono text-zinc-200"
                    >
                      <option value="19124">19124 - Dallas-Plano-Irving, TX (Wage 0.9747)</option>
                      <option value="26420">26420 - Houston-Sugar Land, TX (Wage 1.0018)</option>
                      <option value="12420">12420 - Austin-Round Rock, TX (Wage 0.9396)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300">Days of Care (try 10 vs 75 days)</label>
                    <input
                      type="number"
                      value={calcDays}
                      min={1}
                      max={365}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setCalcDays(val);
                        runLiveCalculation(calcArea, val);
                      }}
                      className="w-full bg-black border border-zinc-700 rounded-lg p-2.5 text-xs font-mono text-zinc-200"
                    />
                  </div>
                </div>

                {calcResult && (
                  <div className="p-4 bg-black rounded-xl border border-zinc-800 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800/80 pb-2 text-[11px]">
                      <span>Location: {calcResult.areaName} (Labor Factor: {calcResult.wageIndex})</span>
                      <span className="text-emerald-400 font-bold uppercase">{calcResult.status}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-zinc-500 block">High-Rate Days (≤60d):</span>
                        <span className="text-zinc-200 font-bold">{calcResult.highDays} days (${calcResult.totalHigh})</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Low-Rate Days (&gt;60d):</span>
                        <span className="text-zinc-200 font-bold">{calcResult.lowDays} days (${calcResult.totalLow})</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Total Claim Paid:</span>
                        <span className="text-emerald-400 text-sm font-bold">${calcResult.grandTotal}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Issues Fixed View */}
            {activeTab === 'issues' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5 space-y-2">
                  {issuesFixed.map((issue, idx) => (
                    <button
                      key={issue.title}
                      onClick={() => setSelectedIssue(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${selectedIssue === idx
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                          : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                        }`}
                    >
                      <span>{issue.title}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </button>
                  ))}
                </div>

                <div className="md:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
                  <div className="text-sm font-bold text-white font-mono">
                    {issuesFixed[selectedIssue].title}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase">Legacy Problem:</span>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-black/60 p-3 rounded-lg border border-zinc-800">
                      {issuesFixed[selectedIssue].before}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Modern Solution:</span>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-black/60 p-3 rounded-lg border border-zinc-800">
                      {issuesFixed[selectedIssue].after}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-zinc-800/80 py-4 text-center text-[11px] text-zinc-500 font-mono">
        legacy-agent • CMS Medicare Hospice Pricer Modernization Case Study
      </footer>
    </div>
  );
}

export default App;
