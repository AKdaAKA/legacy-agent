000100*
000200****************************************************************
000300*   2020.0 HOSPICE COPYBOOK OF PAYMENT RATES - FY 2020.0       *
000400*                                                              *
000500*             HOSPRATE COPY BOOK                               *
000600*    << ONLY AVAILABLE FROM FY2016 FORWARD >>                  *
000700*         (PRIOR YEAR RATES ARE HARD CODED)                    *
000800*                                                              *
000900*   FOR USE IN HOSPR200 (REVISIONS FOR OCT 1, 2018)            *
001000*                                                              *
001100****************************************************************
001200
001300 01  2016-DATA-VALUES.
001400     05  2016-EFF-DATE             PIC X(08)  VALUE '20151001'.
001500     05  2016-HOSPICE-RATES.
001600         10  2016-RHC-LS-RATE      PIC 999V99 VALUE 111.23.
001700         10  2016-RHC-NLS-RATE     PIC 999V99 VALUE 050.66.
001800         10  2016-CHC-LS-RATE      PIC 999V99 VALUE 649.17.
001900         10  2016-CHC-NLS-RATE     PIC 999V99 VALUE 295.62.
002000         10  2016-IRC-LS-RATE      PIC 999V99 VALUE 090.64.
002100         10  2016-IRC-NLS-RATE     PIC 999V99 VALUE 076.81.
002200         10  2016-GIC-LS-RATE      PIC 999V99 VALUE 460.94.
002300         10  2016-GIC-NLS-RATE     PIC 999V99 VALUE 259.17.
002400
002500     05  2016-HOSPICE-RATES-Q.
002600         10  2016-RHC-LS-RATE-Q    PIC 999V99 VALUE 109.04.
002700         10  2016-RHC-NLS-RATE-Q   PIC 999V99 VALUE 049.66.
002800         10  2016-CHC-LS-RATE-Q    PIC 999V99 VALUE 636.39.
002900         10  2016-CHC-NLS-RATE-Q   PIC 999V99 VALUE 289.80.
003000         10  2016-IRC-LS-RATE-Q    PIC 999V99 VALUE 088.85.
003100         10  2016-IRC-NLS-RATE-Q   PIC 999V99 VALUE 075.30.
003200         10  2016-GIC-LS-RATE-Q    PIC 999V99 VALUE 451.87.
003300         10  2016-GIC-NLS-RATE-Q   PIC 999V99 VALUE 254.06.
003400
003500
003600
003700 01  2016-V161-DATA-VALUES.
003800     05  2016-V161-EFF-DATE        PIC X(08)  VALUE '20160101'.
003900     05  2016-V161-HOSPICE-RATES.
004000         10  2016-V161-HIGH-RHC-LS-RATE
004100                                   PIC 999V99 VALUE 128.38.
004200         10  2016-V161-HIGH-RHC-NLS-RATE
004300                                   PIC 999V99 VALUE 058.46.
004400         10  2016-V161-LOW-RHC-LS-RATE
004500                                   PIC 999V99 VALUE 100.89.
004600         10  2016-V161-LOW-RHC-NLS-RATE
004700                                   PIC 999V99 VALUE 045.94.
004800         10  2016-V161-CHC-LS-RATE
004900                                   PIC 999V99 VALUE 649.17.
005000         10  2016-V161-CHC-NLS-RATE
005100                                   PIC 999V99 VALUE 295.62.
005200         10  2016-V161-IRC-LS-RATE PIC 999V99 VALUE 090.64.
005300         10  2016-V161-IRC-NLS-RATE
005400                                   PIC 999V99 VALUE 076.81.
005500         10  2016-V161-GIC-LS-RATE PIC 999V99 VALUE 460.94.
005600         10  2016-V161-GIC-NLS-RATE
005700                                   PIC 999V99 VALUE 259.17.
005800
005900
006000     05  2016-V161-HOSPICE-RATES-Q.
006100         10  2016-V161-HIGH-RHC-LS-RATE-Q
006200                                   PIC 999V99 VALUE 125.86.
006300         10  2016-V161-HIGH-RHC-NLS-RATE-Q
006400                                   PIC 999V99 VALUE 057.31.
006500         10  2016-V161-LOW-RHC-LS-RATE-Q
006600                                   PIC 999V99 VALUE 098.90.
006700         10  2016-V161-LOW-RHC-NLS-RATE-Q
006800                                   PIC 999V99 VALUE 045.04.
006900         10  2016-V161-CHC-LS-RATE-Q
007000                                   PIC 999V99 VALUE 636.39.
007100         10  2016-V161-CHC-NLS-RATE-Q
007200                                   PIC 999V99 VALUE 289.80.
007300         10  2016-V161-IRC-LS-RATE-Q
007400                                   PIC 999V99 VALUE 088.85.
007500         10  2016-V161-IRC-NLS-RATE-Q
007600                                   PIC 999V99 VALUE 075.30.
007700         10  2016-V161-GIC-LS-RATE-Q
007800                                   PIC 999V99 VALUE 451.87.
007900         10  2016-V161-GIC-NLS-RATE-Q
008000                                   PIC 999V99 VALUE 254.06.
008100
008200****************************************************************
008300*   2017.0 HOSPICE COPYBOOK OF PAYMENT RATES - FY 2017.0       *
008400****************************************************************
008500
008600 01  2017-V170-DATA-VALUES.
008700     05  2017-V170-EFF-DATE        PIC X(08)  VALUE '20161001'.
008800     05  2017-V170-HOSPICE-RATES.
008900         10  2017-V170-HIGH-RHC-LS-RATE
009000                                   PIC 999V99 VALUE 130.93.
009100         10  2017-V170-HIGH-RHC-NLS-RATE
009200                                   PIC 999V99 VALUE 059.62.
009300         10  2017-V170-LOW-RHC-LS-RATE
009400                                   PIC 999V99 VALUE 102.94.
009500         10  2017-V170-LOW-RHC-NLS-RATE
009600                                   PIC 999V99 VALUE 046.88.
009700         10  2017-V170-CHC-LS-RATE
009800                                   PIC 999V99 VALUE 662.80.
009900         10  2017-V170-CHC-NLS-RATE
010000                                   PIC 999V99 VALUE 301.83.
010100         10  2017-V170-IRC-LS-RATE PIC 999V99 VALUE 092.55.
010200         10  2017-V170-IRC-NLS-RATE
010300                                   PIC 999V99 VALUE 078.42.
010400         10  2017-V170-GIC-LS-RATE PIC 999V99 VALUE 470.44.
010500         10  2017-V170-GIC-NLS-RATE
010600                                   PIC 999V99 VALUE 264.50.
010700
010800
010900     05  2017-V170-HOSPICE-RATES-Q.
011000         10  2017-V170-HIGH-RHC-LS-RATE-Q
011100                                   PIC 999V99 VALUE 128.36.
011200         10  2017-V170-HIGH-RHC-NLS-RATE-Q
011300                                   PIC 999V99 VALUE 058.46.
011400         10  2017-V170-LOW-RHC-LS-RATE-Q
011500                                   PIC 999V99 VALUE 100.93.
011600         10  2017-V170-LOW-RHC-NLS-RATE-Q
011700                                   PIC 999V99 VALUE 045.96.
011800         10  2017-V170-CHC-LS-RATE-Q
011900                                   PIC 999V99 VALUE 649.81.
012000         10  2017-V170-CHC-NLS-RATE-Q
012100                                   PIC 999V99 VALUE 295.92.
012200         10  2017-V170-IRC-LS-RATE-Q
012300                                   PIC 999V99 VALUE 090.73.
012400         10  2017-V170-IRC-NLS-RATE-Q
012500                                   PIC 999V99 VALUE 076.89.
012600         10  2017-V170-GIC-LS-RATE-Q
012700                                   PIC 999V99 VALUE 461.22.
012800         10  2017-V170-GIC-NLS-RATE-Q
012900                                   PIC 999V99 VALUE 259.32.
013000
013100
013200
013300****************************************************************
013400*   2018.0 HOSPICE COPYBOOK OF PAYMENT RATES - FY 2018.0       *
013500****************************************************************
013600
013700 01  2018-V180-DATA-VALUES.
013800     05  2018-V180-EFF-DATE        PIC X(08)  VALUE '20171001'.
013900     05  2018-V180-HOSPICE-RATES.
014000         10  2018-V180-HIGH-RHC-LS-RATE
014100                                   PIC 999V99 VALUE 132.46.
014200         10  2018-V180-HIGH-RHC-NLS-RATE
014300                                   PIC 999V99 VALUE 060.32.
014400         10  2018-V180-LOW-RHC-LS-RATE
014500                                   PIC 999V99 VALUE 104.03.
014600         10  2018-V180-LOW-RHC-NLS-RATE
014700                                   PIC 999V99 VALUE 047.38.
014800         10  2018-V180-CHC-LS-RATE
014900                                   PIC 999V99 VALUE 670.90.
015000         10  2018-V180-CHC-NLS-RATE
015100                                   PIC 999V99 VALUE 305.52.
015200         10  2018-V180-IRC-LS-RATE PIC 999V99 VALUE 093.53.
015300         10  2018-V180-IRC-NLS-RATE
015400                                   PIC 999V99 VALUE 079.25.
015500         10  2018-V180-GIC-LS-RATE PIC 999V99 VALUE 475.95.
015600         10  2018-V180-GIC-NLS-RATE
015700                                   PIC 999V99 VALUE 267.60.
015800
015900
016000     05  2018-V180-HOSPICE-RATES-Q.
016100         10  2018-V180-HIGH-RHC-LS-RATE-Q
016200                                   PIC 999V99 VALUE 129.84.
016300         10  2018-V180-HIGH-RHC-NLS-RATE-Q
016400                                   PIC 999V99 VALUE 059.13.
016500         10  2018-V180-LOW-RHC-LS-RATE-Q
016600                                   PIC 999V99 VALUE 101.97.
016700         10  2018-V180-LOW-RHC-NLS-RATE-Q
016800                                   PIC 999V99 VALUE 046.44.
016900         10  2018-V180-CHC-LS-RATE-Q
017000                                   PIC 999V99 VALUE 657.61.
017100         10  2018-V180-CHC-NLS-RATE-Q
017200                                   PIC 999V99 VALUE 299.47.
017300         10  2018-V180-IRC-LS-RATE-Q
017400                                   PIC 999V99 VALUE 091.67.
017500         10  2018-V180-IRC-NLS-RATE-Q
017600                                   PIC 999V99 VALUE 077.69.
017700         10  2018-V180-GIC-LS-RATE-Q
017800                                   PIC 999V99 VALUE 466.52.
017900         10  2018-V180-GIC-NLS-RATE-Q
018000                                   PIC 999V99 VALUE 262.31.
018100
018200
018300
018400****************************************************************
018500*   2019.0 HOSPICE COPYBOOK OF PAYMENT RATES - FY 2019.0       *
018600****************************************************************
018700
018800 01  2019-V190-DATA-VALUES.
018900     05  2019-V190-EFF-DATE        PIC X(08)  VALUE '20181001'.
019000     05  2019-V190-HOSPICE-RATES.
019100         10  2019-V190-HIGH-RHC-LS-RATE
019200                                   PIC 999V99 VALUE 134.84.
019300         10  2019-V190-HIGH-RHC-NLS-RATE
019400                                   PIC 999V99 VALUE 061.41.
019500         10  2019-V190-LOW-RHC-LS-RATE
019600                                   PIC 999V99 VALUE 105.96.
019700         10  2019-V190-LOW-RHC-NLS-RATE
019800                                   PIC 999V99 VALUE 048.25.
019900         10  2019-V190-CHC-LS-RATE
020000                                   PIC 999V99 VALUE 685.30.
020100         10  2019-V190-CHC-NLS-RATE
020200                                   PIC 999V99 VALUE 312.08.
020300         10  2019-V190-IRC-LS-RATE PIC 999V99 VALUE 095.27.
020400         10  2019-V190-IRC-NLS-RATE
020500                                   PIC 999V99 VALUE 080.74.
020600         10  2019-V190-GIC-LS-RATE PIC 999V99 VALUE 485.24.
020700         10  2019-V190-GIC-NLS-RATE
020800                                   PIC 999V99 VALUE 272.83.
020900
021000
021100     05  2019-V190-HOSPICE-RATES-Q.
021200         10  2019-V190-HIGH-RHC-LS-RATE-Q
021300                                   PIC 999V99 VALUE 132.19.
021400         10  2019-V190-HIGH-RHC-NLS-RATE-Q
021500                                   PIC 999V99 VALUE 060.20.
021600         10  2019-V190-LOW-RHC-LS-RATE-Q
021700                                   PIC 999V99 VALUE 103.88.
021800         10  2019-V190-LOW-RHC-NLS-RATE-Q
021900                                   PIC 999V99 VALUE 047.30.
022000         10  2019-V190-CHC-LS-RATE-Q
022100                                   PIC 999V99 VALUE 671.83.
022200         10  2019-V190-CHC-NLS-RATE-Q
022300                                   PIC 999V99 VALUE 305.95.
022400         10  2019-V190-IRC-LS-RATE-Q
022500                                   PIC 999V99 VALUE 093.41.
022600         10  2019-V190-IRC-NLS-RATE-Q
022700                                   PIC 999V99 VALUE 079.15.
022800         10  2019-V190-GIC-LS-RATE-Q
022900                                   PIC 999V99 VALUE 475.71.
023000         10  2019-V190-GIC-NLS-RATE-Q
023100                                   PIC 999V99 VALUE 267.47.
023200
023300
023400
023500****************************************************************
023600*   2020.0 HOSPICE COPYBOOK OF PAYMENT RATES - FY 2020.0       *
023700****************************************************************
023800
023900 01  2020-V200-DATA-VALUES.
024000     05  2020-V200-EFF-DATE        PIC X(08)  VALUE '20191001'.
024100     05  2020-V200-HOSPICE-RATES.
024200         10  2020-V200-HIGH-RHC-LS-RATE
024300                                   PIC 999V99 VALUE 133.64.
024400         10  2020-V200-HIGH-RHC-NLS-RATE
024500                                   PIC 999V99 VALUE 060.86.
024600         10  2020-V200-LOW-RHC-LS-RATE
024700                                   PIC 999V99 VALUE 105.62.
024800         10  2020-V200-LOW-RHC-NLS-RATE
024900                                   PIC 999V99 VALUE 048.10.
025000         10  2020-V200-CHC-LS-RATE
025100                                   PIC 999V99 VALUE 958.94.
025200         10  2020-V200-CHC-NLS-RATE
025300                                   PIC 999V99 VALUE 436.69.
025400         10  2020-V200-IRC-LS-RATE PIC 999V99 VALUE 243.64.
025500         10  2020-V200-IRC-NLS-RATE
025600                                   PIC 999V99 VALUE 206.46.
025700         10  2020-V200-GIC-LS-RATE PIC 999V99 VALUE 653.70.
025800         10  2020-V200-GIC-NLS-RATE
025900                                   PIC 999V99 VALUE 367.55.
026000
026100
026200     05  2020-V200-HOSPICE-RATES-Q.
026300         10  2020-V200-HIGH-RHC-LS-RATE-Q
026400                                   PIC 999V99 VALUE 131.04.
026500         10  2020-V200-HIGH-RHC-NLS-RATE-Q
026600                                   PIC 999V99 VALUE 059.67.
026700         10  2020-V200-LOW-RHC-LS-RATE-Q
026800                                   PIC 999V99 VALUE 103.56.
026900         10  2020-V200-LOW-RHC-NLS-RATE-Q
027000                                   PIC 999V99 VALUE 047.16.
027100         10  2020-V200-CHC-LS-RATE-Q
027200                                   PIC 999V99 VALUE 940.24.
027300         10  2020-V200-CHC-NLS-RATE-Q
027400                                   PIC 999V99 VALUE 428.18.
027500         10  2020-V200-IRC-LS-RATE-Q
027600                                   PIC 999V99 VALUE 238.89.
027700         10  2020-V200-IRC-NLS-RATE-Q
027800                                   PIC 999V99 VALUE 202.43.
027900         10  2020-V200-GIC-LS-RATE-Q
028000                                   PIC 999V99 VALUE 640.96.
028100         10  2020-V200-GIC-NLS-RATE-Q
028200                                   PIC 999V99 VALUE 360.39.
028300*
