#!/bin/bash
# Bridge: OpenClaw → Convex
# Usage: ./scripts/bridge.sh agent-status <name> <status> [tokens] [cost]
#        ./scripts/bridge.sh session-log <agentName> <tokens> <cost> [summary]
#        ./scripts/bridge.sh task <title> [priority] [agentName]

CONVEX_URL="https://oceanic-mallard-600.eu-west-1.convex.site"

case "$1" in
  agent-status)
    curl -s -X POST "$CONVEX_URL/api/agent-status" \
      -H "Content-Type: application/json" \
      -d "{\"name\":\"$2\",\"status\":\"$3\",\"tokens\":${4:-0},\"cost\":${5:-0}}"
    ;;
  session-log)
    curl -s -X POST "$CONVEX_URL/api/session-log" \
      -H "Content-Type: application/json" \
      -d "{\"agentName\":\"$2\",\"tokenCount\":${3:-0},\"cost\":${4:-0},\"summary\":\"${5:-}\"}"
    ;;
  task)
    curl -s -X POST "$CONVEX_URL/api/task" \
      -H "Content-Type: application/json" \
      -d "{\"title\":\"$2\",\"priority\":\"${3:-medium}\",\"agentName\":\"${4:-}\"}"
    ;;
  *)
    echo "Usage: bridge.sh <agent-status|session-log|task> ..."
    ;;
esac
