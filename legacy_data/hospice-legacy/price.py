#!/usr/bin/env python3
"""
Run hospice claims through the ORIGINAL CMS COBOL pricer (HOSPR200, FY2020).

This script only builds the 315-character mainframe bill record, calls the
compiled COBOL (./hospice_pricer), and reads the answer back. All the payment
math happens inside the CMS COBOL code.

Examples
  python3 price.py --cbsa 19124 --admit 2019-12-01 --from 2020-03-01 --rhc 10
  python3 price.py --csv sample_claims.csv
"""
import argparse, csv, os, subprocess, sys, tempfile
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
BIN = os.path.join(HERE, "hospice_pricer")
CBSA_FILE = os.path.join(HERE, "data", "CBSA2020.txt")

RTC_MEANING = {
    "00": "Paid - home rate",
    "73": "Paid - low routine-home-care rate (day 61+)",
    "74": "Paid - low RHC rate + end-of-life add-on",
    "75": "Paid - high RHC rate (first 60 days) for some/all days",
    "77": "Paid - high RHC rate + end-of-life add-on",
    "10": "ERROR - bad units (over 1000)",
    "20": "ERROR - continuous home care units under 8",
    "30": "ERROR - bad CBSA/MSA code",
    "40": "ERROR - bad hospice wage index",
    "50": "ERROR - bad beneficiary wage index",
    "51": "ERROR - bad provider number",
}


def load_cbsa():
    """CBSA file rows look like: '19124 20191001 009747 000000 Dallas-Plano-Irving, TX'"""
    rows = {}
    with open(CBSA_FILE, encoding="latin-1") as f:
        for line in f:
            parts = line.rstrip("\n").split(" ", 4)
            if len(parts) < 3 or not parts[2].isdigit():
                continue
            code, eff, wi = parts[0], parts[1], int(parts[2]) / 10000
            name = parts[4].strip() if len(parts) > 4 else ""
            rows.setdefault(code, []).append((eff, wi, name))
    return rows


def wage_index(cbsa_rows, cbsa, svc_yyyymmdd):
    """Latest wage index whose effective date is on/before the service date."""
    best = None
    for eff, wi, name in cbsa_rows.get(cbsa, []):
        if eff <= svc_yyyymmdd and (best is None or eff > best[0]):
            best = (eff, wi, name)
    if best is None:
        sys.exit(f"CBSA {cbsa} not found for {svc_yyyymmdd} in {CBSA_FILE}")
    return best


def ymd(s):
    return date.fromisoformat(s).strftime("%Y%m%d")


def num(value, digits, decimals=0):
    """COBOL unsigned zoned decimal, e.g. num(0.9747, 6, 4) -> '009747'."""
    return str(round(float(value) * 10 ** decimals)).zfill(digits)[-digits:]


def line_group(rev, units, dos):
    # REV(4) HCPC(5) DOS(8) UNITS(7) PAY(8) = 32 chars
    if not units:
        return " " * 4 + " " * 5 + "0" * 8 + "0" * 7 + "0" * 8
    return rev + " " * 5 + dos + num(units, 7) + "0" * 8


def build_record(c, cbsa_rows):
    frm, adm = ymd(c["from_date"]), ymd(c["admit_date"])
    eff, wi, name = wage_index(cbsa_rows, c["cbsa"], frm)
    rec = (
        "0000000000"                    # NPI
        + "999999"                      # provider number (not used by HOSPR200)
        + frm + adm
        + " " * 10                      # filler
        + c["cbsa"].ljust(5)            # provider CBSA
        + c["cbsa"].ljust(5)            # beneficiary CBSA
        + num(wi, 6, 4) + num(wi, 6, 4) # provider + beneficiary wage index
        + "00" * 9                      # service-intensity add-on units (none)
        + " " * 10                      # filler
        + ("1" if c.get("qip") else " ")  # quality-reporting penalty flag
        + line_group("0651", int(c.get("rhc_days") or 0), frm)   # routine home care (days)
        + line_group("0652", int(c.get("chc_units") or 0), frm)  # continuous home care (15-min units)
        + line_group("0655", int(c.get("irc_days") or 0), frm)   # inpatient respite (days)
        + line_group("0656", int(c.get("gic_days") or 0), frm)   # general inpatient (days)
        + "0" * 72                      # add-on payments (output)
        + "0" * 8 + "  " + "0000"       # total pay, return code, RHC day split (output)
        + " " * 8                       # filler
    )
    assert len(rec) == 315, len(rec)
    return rec, wi, name


def parse_output(rec):
    rec = rec.rstrip("\n").ljust(315)
    money = lambda s: int(s) / 100 if s.strip().isdigit() else 0.0
    g = lambda i: 93 + i * 32          # start of line group i (0-based)
    return {
        "rhc_pay": money(rec[g(0) + 24:g(0) + 32]),
        "chc_pay": money(rec[g(1) + 24:g(1) + 32]),
        "irc_pay": money(rec[g(2) + 24:g(2) + 32]),
        "gic_pay": money(rec[g(3) + 24:g(3) + 32]),
        "total": money(rec[293:301]),
        "rtc": rec[301:303],
        "high_rhc_days": rec[303:305],
        "low_rhc_days": rec[305:307],
    }


def run(claims):
    if not os.path.exists(BIN):
        sys.exit("hospice_pricer not built yet - run ./build.sh first")
    cbsa_rows = load_cbsa()
    built = [build_record(c, cbsa_rows) for c in claims]
    with tempfile.TemporaryDirectory() as tmp:
        with open(os.path.join(tmp, "bills_in.dat"), "w") as f:
            f.writelines(r + "\n" for r, _, _ in built)
        subprocess.run([BIN], cwd=tmp, check=True, stdout=subprocess.DEVNULL)
        with open(os.path.join(tmp, "bills_out.dat")) as f:
            outs = [parse_output(l) for l in f]
    results = []
    for c, (_, wi, name), o in zip(claims, built, outs):
        results.append({**c, "wage_index": wi, "area": name, **o,
                        "meaning": RTC_MEANING.get(o["rtc"], "unknown code")})
    return results


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--csv", help="CSV of claims (see sample_claims.csv)")
    ap.add_argument("--cbsa", help="5-digit area code, e.g. 19124 = Dallas-Plano-Irving")
    ap.add_argument("--admit", help="hospice admission date YYYY-MM-DD")
    ap.add_argument("--from", dest="from_date", help="claim start date YYYY-MM-DD (FY2020: 2019-10-01..2020-09-30)")
    ap.add_argument("--rhc", type=int, default=0, help="routine home care days")
    ap.add_argument("--chc", type=int, default=0, help="continuous home care units (15 min each, min 8)")
    ap.add_argument("--irc", type=int, default=0, help="inpatient respite care days")
    ap.add_argument("--gic", type=int, default=0, help="general inpatient care days")
    ap.add_argument("--qip", action="store_true", help="hospice missed quality reporting (lower rates)")
    ap.add_argument("--out", help="write results to this CSV")
    a = ap.parse_args()

    if a.csv:
        with open(a.csv, newline="") as f:
            claims = [{k: (v or "").strip() for k, v in r.items()} for r in csv.DictReader(f)]
        for c in claims:
            c["qip"] = c.get("qip", "").upper() in ("1", "Y", "YES", "TRUE")
    elif a.cbsa and a.admit and a.from_date:
        claims = [{"claim_id": "CLI", "cbsa": a.cbsa, "admit_date": a.admit, "from_date": a.from_date,
                   "rhc_days": a.rhc, "chc_units": a.chc, "irc_days": a.irc, "gic_days": a.gic, "qip": a.qip}]
    else:
        ap.error("give --csv FILE, or --cbsa --admit --from plus some care days")

    results = run(claims)
    for r in results:
        print(f"{r.get('claim_id',''):<6} {r['area'][:28]:<28} WI={r['wage_index']:.4f}  "
              f"RHC={r['rhc_pay']:>9.2f} CHC={r['chc_pay']:>9.2f} IRC={r['irc_pay']:>9.2f} "
              f"GIC={r['gic_pay']:>9.2f}  TOTAL=${r['total']:>10.2f}  RTC={r['rtc']} ({r['meaning']})")
    if a.out:
        keys = list(results[0].keys())
        with open(a.out, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=keys)
            w.writeheader()
            w.writerows(results)
        print(f"wrote {a.out}")


if __name__ == "__main__":
    main()
