#!/bin/sh
# app.sh

echo "init db tables..."
sleep 5
pnpm db:push
echo "init db tables done"

if [ -n "$INIT_DB" ]; then
  pnpm script scripts/init.ts
fi

echo "starting app..."
exec pnpm start
