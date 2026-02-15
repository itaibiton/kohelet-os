#!/bin/bash
# Sync OpenClaw cron jobs to Convex

CONVEX_URL="https://oceanic-mallard-600.eu-west-1.convex.cloud"

create_cron() {
  local name="$1"
  local schedule="$2"
  curl -s -X POST "$CONVEX_URL/api/cron" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\",\"schedule\":\"$schedule\",\"enabled\":true}"
}

create_cron "Morning Brief" "07:00"
create_cron "REOS Intel Morning" "08:30"
create_cron "Midday Brief" "11:00"
create_cron "Afternoon Brief" "15:00"
create_cron "Market Open" "16:30 Mon-Fri"
create_cron "REOS Intel Evening" "19:00"
create_cron "Evening Brief" "20:00"
create_cron "Night Summary" "23:30"
create_cron "Token Health Check" "07:00"
create_cron "Thursday Reminder" "06:00 Thu"
create_cron "Adar Birthday Morning" "08:00"
create_cron "Adar Birthday Evening" "20:00"
