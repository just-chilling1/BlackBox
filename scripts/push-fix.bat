@echo off
cd /d "%~dp0.."
echo Quick push (no local build) ...
call node scripts\copy-logos-now.mjs 2>nul
git add -A
git reset HEAD -- .env .env.local 2>nul
git commit -m "Fix Vercel build and ship NullPing logo + theme." -m "Resolve BrandLogo TypeScript error, remove stale thumbnailSrc, and commit logo assets."
git push https://github.com/just-chilling1/BlackBox.git HEAD:main
if errorlevel 1 git push origin HEAD
echo.
git log -1 --oneline
echo.
echo Watch deploy: https://vercel.com/essams-projects-52baa131/black-box
pause
