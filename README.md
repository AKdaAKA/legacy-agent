# legacy-agent ⚡

> **Modernize mission-critical legacy COBOL into clean, typed Python microservices with mathematically proven parity.**

[![Parity Benchmark](https://img.shields.io/badge/Parity_Accuracy-2%2C000%2F2%2C000_Claims_(100%25)-emerald)](https://github.com/AKdaAKA/legacy-agent)
[![Code Reduction](https://img.shields.io/badge/Code_Reduction-97%25_(5%2C842_%E2%86%92_173_lines)-cyan)](https://github.com/AKdaAKA/legacy-agent)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## The Problem: Trillions of Dollars Stuck in 1959

COBOL was built in 1959 for punched cards and batch tapes. Because it was reliable at handling high-volume sequential records, banks, airlines, and government systems like **Medicare** built their core payment infrastructure on it in the 60s, 70s, and 80s.

Today, those systems are a ticking time bomb:
1. **The Talent Cliff**: The original mainframe programmers have retired. Engineering teams must reverse-engineer procedural copybooks written in a dead language.
2. **Rigid 315-Character Buffers**: COBOL expects data packed into exact character offsets. Shift one space, and Dallas's area code becomes the billing rate with **no compiler warning**.
3. **The Silent Failure Trap**: COBOL never throws exceptions. If a clerk makes a typo, COBOL never says *"I don't know"*. It returns a check and a success code (`RTC=75`), even when the calculation is wrong by **$132,000**!

> *"Medicare spent years manually converting 10 Pricer applications to Java by hand. Our platform does it in minutes, and mathematically proves equivalence against official CMS test data down to the exact penny."*

---

## Real-World Example: CMS Medicare Hospice Pricer

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

## Before vs. After: Mathematical Parity

| Metric / Scenario | Legacy COBOL (1980s Mainframe) | Modernized Python (`legacy-agent`) |
| :--- | :--- | :--- |
| **Code Size** | **5,842 lines** across copybooks | **173 lines** (`price.py`) |
| **Valid Claim (10 Days Dallas)** | `$1,911.19` *(RTC=75 "SUCCESS")* | `{"status": "paid", "total": "1911.19"}` ✅ **Exact Match** |
| **Wage Typo (99.9999)** | `$134,248.47` *(Overpaid \$132,337 silently)* | ❌ **Rejected**: `"Locked to CBSA area table"` |
| **Wrong Fiscal Year (2025 Claim)** | `$1,911.19` *(Underpaid by ~$298 with no warning)* | ❌ **Rejected**: `"Outside FY2020. Route to rates_fy2025.json"` |
| **Care in Wrong Slot** | `$0.00` *(Clinic shorted \$5,023.56 with "SUCCESS")* | ✅ **Paid**: `$5,023.56` *(Named fields prevent offset errors)* |
| **Admit Date after Care Date** | `$0.00` *(Zero explanation provided)* | ❌ **Rejected**: `"Admission date is after service date"` |
| **Rate Configuration** | Hardcoded inside copybook binaries | Decoupled JSON file (`rates_fy2020.json`) |
| **Benchmark Regression** | Manual batch verification | **2,000 / 2,000 claims match to the penny** ($1,874,418.16) |

---

## The 4-Decimal Rounding Discovery

During dual-engine regression testing, **6 of 500 initial crisis-care claims** were off by exactly **1 cent**. 

Our analysis engine identified the hidden quirk:
* COBOL divides daily crisis care by 24 and **truncates the intermediate hourly rate to 4 decimal places** before multiplying by hours.
* A naive AI rewrite loses this nuance and fails financial parity audits.
* `legacy-agent` detects and faithfully preserves that quirk with comments in `price.py`, guaranteeing 100% audit parity.

---

## Quickstart (Run Web App Locally)

```bash
# Clone the repository
git clone https://github.com/AKdaAKA/legacy-agent.git
cd legacy-agent

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **`http://localhost:5173/`** to run the interactive modernization studio.

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
