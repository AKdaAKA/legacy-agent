#!/bin/sh
# Builds the original CMS hospice pricer (HOSPR200) plus our small test driver.
# Needs GnuCOBOL:  Mac -> brew install gnucobol   |  Ubuntu -> sudo apt install gnucobol3
set -e
cd "$(dirname "$0")/src"
cobc -x -std=ibm -I . -o ../hospice_pricer HOSRUN.cbl HOSPR200.cbl
echo "Built ./hospice_pricer"
