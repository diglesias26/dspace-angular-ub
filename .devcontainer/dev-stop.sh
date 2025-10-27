#!/usr/bin/env bash
set -euo pipefail
PIDFILE="/workspace/.dspace-angular-dev.pid"
if [ -f "$PIDFILE" ]; then
  echo "Stopping Dspace-angular…"
  kill "$(cat "$PIDFILE")" 2>/dev/null || true
  echo "Removing auxiliary files..."
  rm "$PIDFILE"
  rm -f /workspace/.dspace-angular-dev.log
  rm -f /workspace/.dspace-angular-ready.log
else
  echo "No Dspace-angular process found"
fi