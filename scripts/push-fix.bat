@echo off
cd /d "%~dp0.."
echo === Push BrandLogo TypeScript fix to GitHub ===
echo.

git status -sb
echo.

git add src/components/layout/BrandLogo.tsx
git add -A
git reset HEAD -- .env .env.local 2>nul

git commit -m "Resolve merge conflicts and ship support, money-page, and BrandLogo fixes."
if errorlevel 1 (
  echo No new commit needed - checking if already pushed...
)

echo.
echo Pushing to https://github.com/just-chilling1/BlackBox.git ...
git push https://github.com/just-chilling1/BlackBox.git HEAD:main
if errorlevel 1 (
  git push origin HEAD
  if errorlevel 1 (
    echo PUSH FAILED
    pause
    exit /b 1
  )
)

echo.
echo === Result ===
git log -1 --oneline
git status -sb
echo.
echo GitHub: https://github.com/just-chilling1/BlackBox
echo Vercel: https://vercel.com/essams-projects-52baa131/black-box
pause
