       IDENTIFICATION DIVISION.
       PROGRAM-ID. HOSRUN.
      *----------------------------------------------------------------
      * HACKATHON TEST DRIVER (NOT PART OF THE CMS CODE)
      * READS 315-BYTE BILL RECORDS FROM bills_in.dat, CALLS THE
      * ORIGINAL CMS PRICER HOSPR200 ON EACH ONE, AND WRITES THE
      * PRICED RECORD TO bills_out.dat.  THIS REPLACES THE MAINFRAME
      * PIECES (HOSOP200 / HOSDR200 / JCL) THAT A MAC CANNOT RUN.
      *----------------------------------------------------------------
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT BILLIN  ASSIGN TO "bills_in.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT BILLOUT ASSIGN TO "bills_out.dat"
               ORGANIZATION IS LINE SEQUENTIAL.
       DATA DIVISION.
       FILE SECTION.
       FD  BILLIN.
       01  IN-REC                  PIC X(315).
       FD  BILLOUT.
       01  OUT-REC                 PIC X(315).
       WORKING-STORAGE SECTION.
       01  WS-EOF                  PIC X VALUE 'N'.
       01  WS-COUNT                PIC 9(6) VALUE 0.
       01  BILL-315-DATA           PIC X(315).
       PROCEDURE DIVISION.
           OPEN INPUT BILLIN
                OUTPUT BILLOUT
           PERFORM UNTIL WS-EOF = 'Y'
               READ BILLIN
                   AT END
                       MOVE 'Y' TO WS-EOF
                   NOT AT END
                       MOVE IN-REC TO BILL-315-DATA
                       CALL 'HOSPR200' USING BILL-315-DATA
                       MOVE BILL-315-DATA TO OUT-REC
                       WRITE OUT-REC
                       ADD 1 TO WS-COUNT
               END-READ
           END-PERFORM
           CLOSE BILLIN BILLOUT
           DISPLAY 'HOSRUN: PRICED ' WS-COUNT ' CLAIM(S)'
           STOP RUN.
