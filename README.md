# legacy-agent ⚡

> **Turn legacy COBOL source into a reviewable Python draft with Gemini and local code retrieval.**

[![Parity Benchmark](https://img.shields.io/badge/Parity_Accuracy-2%2C000%2F2%2C000_Claims_(100%25)-emerald)](https://github.com/AKdaAKA/legacy-agent)
[![Code Reduction](https://img.shields.io/badge/Code_Reduction-97%25_(5%2C842_%E2%86%92_173_lines)-cyan)](https://github.com/AKdaAKA/legacy-agent)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## The Problem: Legacy Code Is Hard to Change

COBOL was built in 1959 for punched cards and batch tapes. Its reliability made it a natural fit for high-volume systems, and banks, airlines, and government agencies built important programs with it.

Understanding and updating these programs can be difficult. Business rules may be spread across large files, and some systems use fixed-width records where every field depends on its exact character position.

**legacy-agent** is an experimental tool that uses Gemini to draft Python from uploaded COBOL. For larger sources, local BM25 retrieval selects relevant code sections for Gemini. The generated code is a draft that must be reviewed and tested. The app does not automatically prove parity for arbitrary uploads.

---

## Example: CMS Medicare Hospice Pricer

### The Input
A hospice patient in **Dallas, TX** (`19124`), admitted on **Feb 1, 2020**, receives **10 days of routine home care** starting on **March 1, 2020** with a local labor factor of `0.9747`.

```
BEFORE (COBOL): You must pack an unreadable 315-character mainframe record:
00000000009999992020030120200201          1912419124009747009747000000000000000000        0651     20200301000001000000000 ...

AFTER (Modern Python): You pass a clean, typed JSON payload:
{
  "patient_area": "19124",
  "admission_date": "2020-02-01",
  "service_date": "2020-03-01",
  "routine_home_days": 10
}
```

---

This is a separate CMS FY2020 Medicare Hospice Pricer case study included in the repository. Its example and benchmark figures are not results for code generated from an arbitrary upload.

---

## The 4-Decimal Rounding Discovery

During dual-engine regression testing, **6 of 500 initial crisis-care claims** were off by exactly **1 cent**. 

Our analysis engine identified the hidden quirk:
* COBOL divides daily crisis care by 24 and **truncates the intermediate hourly rate to 4 decimal places** before multiplying by hours.
* A naive AI rewrite loses this nuance and fails financial parity audits.
* The Python implementation in this hospice-pricer case study preserves that quirk. These benchmark results apply only to this example, not to arbitrary Gemini conversions.

---

## Quickstart (Run Web App Locally)

Requires Node.js 20 or newer.

```bash
# Clone the repository
git clone https://github.com/AKdaAKA/legacy-agent.git
cd legacy-agent

# Install dependencies
npm install

# Configure Gemini on the server (never put the key in frontend code)
cp .env.example .env
# Set GEMINI_API_KEY in .env to a newly created key

# Start the web app and conversion API
npm run dev
```

Open **`http://localhost:5173/`** to run the interactive modernization studio. Upload `.cbl`, `.cob`, `.cpy`, or a `.zip` containing those source files, then select **Convert COBOL to Python with Gemini**. The built-in hospice demo loads sample COBOL source from the repository.

The API key is read only by the local Node API (`server/index.mjs`) from `GEMINI_API_KEY`; it is not exposed to Vite or sent to the browser. The default model is `gemini-2.5-flash`; override it with `GEMINI_MODEL` if needed. Uploaded source is sent to Google's Gemini API for conversion. Generated code is a draft and is not automatically run or parity-verified. Review and test it before production use.

Source files are no longer restricted to 300,000 characters. The API accepts request bodies up to 32 MB; Gemini's model context and service limits still apply.

For larger uploads, the API uses LangChain Core with a local BM25 retriever to build a context pool from 60-line COBOL chunks (10-line overlap). It selects up to 14 relevant chunks within a 26,000-character context budget and keeps each file's first chunk and small copybooks when possible. Sources at or below the budget are sent whole. Retrieval runs locally without an embeddings API call. The conversion result reports the selected ranges; because retrieval can omit code, review the ranges and generated code before relying on its behavior.

For a local production deployment, run `npm start` (default port `3001`) and open **`http://localhost:3001/`**. The start script builds the frontend and serves it together with the API. In production, provide `GEMINI_API_KEY` through the host's secret manager rather than a committed file. The API and frontend must share an origin or be configured behind a same-origin `/api` route.

---

## Testing the Modernized Python Pricer Standalone

```bash
# Price a single claim (Dallas, 10 days home care)
python3 legacy_data/hospice-legacy/price.py --cbsa 19124 --admit 2020-02-01 --from 2020-03-01 --rhc 10

# Price batch claims against the official CMS dataset
python3 legacy_data/hospice-legacy/price.py --csv legacy_data/hospice-legacy/sample_claims.csv
```

---

## License
MIT
