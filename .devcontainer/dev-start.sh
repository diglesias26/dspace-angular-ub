#!/usr/bin/env bash
set -euo pipefail
PORT="${DEV_PORT:-4000}"

# Start Next.js in background
nohup yarn start:dev > /workspace/.dspace-angular-dev.log 2>&1 &
echo $! > /workspace/.dspace-angular-dev.pid

# Check readiness (without blocking)
(
  for i in {1..10}; do
    if curl -fsS "http://127.0.0.1:${PORT}" >/dev/null 2>&1; then
      echo "✅ Dspace-angular started at http://localhost:${PORT}" | tee /workspace/.dspace-angular-ready.txt
      exit 0
    fi
    sleep 60
  done
  echo "⚠️  Dspace-angular not ready after 10*60 seconds. Check /workspace/.dspace-angular-dev.log"
) > /workspace/.dspace-angular-ready.log 2>&1 &
