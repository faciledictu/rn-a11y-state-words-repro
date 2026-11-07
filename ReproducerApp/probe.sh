#!/bin/sh
# Reads every case with A11yProbe; section 7 from a fresh launch after 0 to 3
# presses of Next S. Metro must be running and both APKs installed.
set -e
probe() {
  adb shell "am instrument -w -e wait ${WAIT:-15000} $1 com.reproducerapp.test/com.reproducerapp.A11yProbe"
}

probe "-e targets '^Results B1,^Results B2,^Results L1,^Results L2,^Select all M1,^Select all M2,^Rating V1,^Rating V2,Saving T1,Saving T2,^Inbox A1,^Inbox A2'"

before=''
for presses in 0 1 2 3; do
  echo "#### section 7 after $presses presses"
  if [ -n "$before" ]; then
    probe "-e before '$before' -e targets '^Volume S1,^Volume S2'"
  else
    probe "-e targets '^Volume S1,^Volume S2'"
  fi
  before="${before:+$before,}Next S"
done
