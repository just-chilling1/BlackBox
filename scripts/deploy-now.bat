@echo off
cd /d "%~dp0.."
echo Deploying NullPing updates to Vercel...
echo.

REM Install deps if next is missing (optional; Vercel builds remotely)
if not exist "node_modules\next\package.json" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed - continuing with push anyway ^(Vercel builds remotely^).
  )
)

REM Copy logo PNGs into public/ and brand-assets/
call node scripts\copy-logos-now.mjs
if errorlevel 1 (
  echo Logo copy warning - continuing...
)

echo.
echo Committing and pushing to GitHub ^(Vercel auto-deploys^)...
git add -A
git reset HEAD -- .env .env.local 2>nul
git status -sb

git commit -m "Fix Vercel build and ship NullPing logo + theme." -m "Resolve BrandLogo TypeScript error, remove stale thumbnailSrc, and commit logo assets."
if errorlevel 1 (
  echo Nothing new to commit, pushing existing commits...
)

git push https://github.com/just-chilling1/BlackBox.git HEAD:main
if errorlevel 1 (
  git push origin HEAD
  if errorlevel 1 (
    echo.
    echo PUSH FAILED - check git credentials and try again.
    pause
    exit /b 1
  )
)

echo.
echo Done. Vercel will rebuild in ~1-2 minutes.
echo Check: https://vercel.com/essams-projects-52baa131/black-box
echo Site:  https://black-box-sigma-two.vercel.app
pause
