#!/usr/bin/env bash
#
# Builds chartagencydemo.com and assembles exactly what gets uploaded.
#
# Run from the project root:   bash deploy-package.sh
# Result:                      deploy/  — upload its CONTENTS to the server
#
set -e

echo "==> checking environment"

if [ ! -f .env.production ]; then
  echo "ERROR: .env.production is missing."
  echo "       cp .env.production.example .env.production, then edit it."
  echo "       Its values are read when the server starts, so they can also be"
  echo "       changed later in hPanel without rebuilding."
  exit 1
fi

grep -E '^(CMS_API_URL|SITE_URL)=' .env.production | sed 's/^/    /'

if grep -qE '^REVALIDATE_SECRET=(change-me.*)?$' .env.production; then
  echo "ERROR: set REVALIDATE_SECRET in .env.production (same value as the admin's FRONTEND_REVALIDATE_SECRET)."
  exit 1
fi

echo "==> building"
rm -rf .next deploy

# .env.local wins over .env.production even in a production build, and would bake the
# local admin URL (localhost:8010) into the bundle. Moved aside for the build, restored after.
RESTORE_LOCAL=0
if [ -f .env.local ]; then
  mv .env.local .env.local.build-aside
  RESTORE_LOCAL=1
  echo "    .env.local moved aside for the build"
fi

restore_local() {
  if [ "$RESTORE_LOCAL" = "1" ] && [ -f .env.local.build-aside ]; then
    mv .env.local.build-aside .env.local
  fi
}
trap restore_local EXIT

# The build pre-renders both languages from the live admin API, so the admin must be up first.
npx next build

echo "==> assembling deploy/"
mkdir -p deploy

# The standalone server and the runtime deps it actually reaches.
cp -r .next/standalone/. deploy/

# Standalone omits these two; without them every stylesheet and image 404s.
mkdir -p deploy/.next
cp -r .next/static deploy/.next/static
cp -r public deploy/public

# The server reads CMS_API_URL, SITE_URL and REVALIDATE_SECRET at runtime.
cp .env.production deploy/.env.production

# In this package server.js sits at the root, so `npm start` must point there.
node -e "const f='deploy/package.json',p=require('./'+f);p.scripts={start:'node server.js'};require('fs').writeFileSync(f,JSON.stringify(p,null,2))"

echo
echo "==> done"
echo "    upload the CONTENTS of deploy/ to the app root on the server"
echo "    startup file: server.js"
du -sh deploy 2>/dev/null | sed 's/^/    size: /'
