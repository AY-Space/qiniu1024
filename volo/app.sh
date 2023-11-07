#!/bin/sh
# app.sh

echo "init db tables..."
pnpm db:push
echo "init db tables done"

if [ -n "$INIT_DB" ]; then
  pnpm scripts scripts/init.js
fi

echo "starting app"
exec pnpm dev
