#!/bin/bash
# Auto-sync agent statuses to Convex
# Run this periodically or after cron jobs complete

SITE="https://oceanic-mallard-600.eu-west-1.convex.site"

# Atlas is always active (main session)
curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
  -d '{"name":"Atlas","status":"active","tokens":0,"cost":0}'

# Check if email listener is running → Iris active
if pgrep -f email_listener.py > /dev/null; then
  curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
    -d '{"name":"Iris","status":"active"}'
else
  curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
    -d '{"name":"Iris","status":"error"}'
fi

# Check OpenClaw process → Forge active
if pgrep -f openclaw > /dev/null; then
  curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
    -d '{"name":"Forge","status":"active"}'
fi

# Tempo is active during business hours (7am-11pm Israel)
HOUR=$(TZ=Asia/Jerusalem date +%H)
if [ "$HOUR" -ge 7 ] && [ "$HOUR" -lt 23 ]; then
  curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
    -d '{"name":"Tempo","status":"active"}'
  curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
    -d '{"name":"Scout","status":"active"}'
  curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
    -d '{"name":"Intel","status":"active"}'
else
  curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
    -d '{"name":"Tempo","status":"idle"}'
  curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
    -d '{"name":"Scout","status":"idle"}'
  curl -s -X POST "$SITE/api/agent-status" -H "Content-Type: application/json" \
    -d '{"name":"Intel","status":"idle"}'
fi

echo "Status sync complete: $(date)"
