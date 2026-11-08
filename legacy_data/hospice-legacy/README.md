# Medicare Hospice Pricer (FY2020): Real Legacy COBOL You Can Run

This is the **actual COBOL code Medicare used to calculate hospice payments** for claims from Oct 1, 2019 to Sep 30, 2020. It came from the CMS PC Pricer archive ("FY 2020.0 HOSPICE MF Software"). It's real mainframe code, not a toy.

Our small add-on (`HOSRUN.cbl` + `price.py`) lets it run on a Mac without a mainframe.

---

## What it does, in plain English

When a hospice cares for a Medicare patient, Medicare pays a **daily rate**. The rate depends on:

1. **The type of care**
   | Code | Care type | Paid per |
   |---|---|---|
   | 0651 | Routine Home Care (RHC) | day |
   | 0652 | Continuous Home Care (CHC), crisis care at home | 15-min unit |
   | 0655 | Inpatient Respite Care (IRC), giving family a break | day |
   | 0656 | General Inpatient Care (GIC) | day |
2. **Where the patient is.** Local wages adjust part of the rate (the "wage index"). Dallas is 0.9747, Houston 1.0018.
3. **How long they've been in hospice.** Routine home care pays more for the first 60 days than for day 61+.
4. **Whether the hospice did its quality reporting.** If not, it gets lower rates.

**The core formula:**
```
daily rate = (labor part × wage index) + non-labor part
payment    = daily rate × days
```
Example, 10 routine-care days in Dallas, first 60 days:
`(133.64 × 0.9747 + 60.86) × 10 = $1,911.19`

---

## Run it on a Mac

```bash
# 1. One-time setup (needs Homebrew: https://brew.sh)
xcode-select --install        # C compiler; skip if already installed
brew install gnucobol

# 2. Build (compiles the CMS COBOL + our driver)
./build.sh

# 3. Price one claim: 10 routine-home-care days in Dallas
python3 price.py --cbsa 19124 --admit 2020-02-01 --from 2020-03-01 --rhc 10

# 4. Price a batch and save the results
python3 price.py --csv sample_claims.csv --out results_cobol.csv
```

**Dates must fall in FY2020** (2019-10-01 to 2020-09-30). Other years run different code paths with different rates.

Handy area codes (CBSA): `19124` Dallas-Plano-Irving · `23104` Fort Worth-Arlington · `26420` Houston · `12420` Austin. All of them are in `data/CBSA2020.txt`.

---

## Files

| File | What it is |
|---|---|
| `legacy_original/` | Exactly what CMS shipped. Untouched. |
| `src/HOSPR200.cbl` | **The pricer**, about 5,800 lines. All the payment math lives here. |
| `src/HOSPRATE.cpy` | Copybook of payment rates for FY2016 to FY2020 |
| `src/HOSDR200.cbl` | Mainframe "driver": looks up the provider and wage index, then calls HOSPR200. Not compiled here. |
| `src/HOSOP200.cbl` | Mainframe "opener": loads files into tables, then calls HOSDR200. Not compiled here. |
| `legacy_original/TESTJCL.txt` | The JCL job script used to run it on the mainframe |
| `data/CBSA2020.txt` | Wage index by area and year |
| `src/HOSRUN.cbl` | **Ours.** A tiny driver that replaces HOSOP200/HOSDR200/JCL for local runs. |
| `price.py` | **Ours.** Turns a simple claim into the 315-character mainframe record, runs the COBOL, and reads back the answer. |
| `sample_claims.csv` | 10 test claims |
| `results_cobol.csv` | The COBOL's answers for those claims (your "answer key") |

`src/` holds the same CMS files with Windows line endings removed so GnuCOBOL can read them. The logic is unchanged.

---

## Hidden rules worth showing judges

These are buried in the COBOL. A good modernization tool should find them.

- **The 60-day switch.** Routine home care pays the high rate for the first 60 days since admission, then drops (return code 75 vs 73). Compare H001 and H002 in the samples.
- **Short crisis care gets downgraded.** Continuous home care under 32 units (8 hours) isn't paid hourly. It's paid as **one routine day** instead (sample H009: 4 units → $191.12).
- **Quality penalty.** A `1` in the QIP flag swaps in a whole second set of lower rates (H007 vs H001).
- **Every year is a copy-paste.** HOSPR200 contains the code for FY2013 through FY2020 side by side, picked by `IF BILL-FROM-DATE > ...`. Most of the file is old years.

## Return codes (BILL-RTC)
`00` paid · `73` low RHC rate · `75` high RHC rate · `74`/`77` with end-of-life add-on · `10`/`20`/`30`/`40`/`50`/`51` = error

## Not included / limits
- The provider file and mainframe file loaders (HOSOP200/HOSDR200) don't run here. Our driver passes the wage index straight in.
- End-of-life "service intensity add-on" units are set to 0 by `price.py`. The fields exist in the record if you want to add them.
- Source: CMS PC Pricer & COBOL Text File Archive, https://www.cms.gov/pc-pricerarchive
