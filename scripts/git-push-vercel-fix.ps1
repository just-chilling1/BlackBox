$ErrorActionPreference = 'Stop'
Set-Location 'c:\Users\gt\Desktop\blackbox'
$log = Join-Path $PWD 'scripts\git-push-report.txt'

function Log($msg) { Add-Content -Path $log -Value $msg }

Remove-Item $log -ErrorAction SilentlyContinue
Log "started $(Get-Date -Format o)"

try {
  git add src/components/layout/BrandLogo.tsx src/components/premium/PremiumWorkflowShell.tsx 2>&1 | Out-String | ForEach-Object { Log $_ }

  $commitMsg = @'
Fix Vercel build TypeScript errors for logo and video tutorial.

Remove invalid logo fallback comparison and unused thumbnailSrc prop.
'@

  git commit -m $commitMsg 2>&1 | Out-String | ForEach-Object { Log $_ }
  Log (git log -1 --oneline 2>&1 | Out-String)
  git push origin HEAD 2>&1 | Out-String | ForEach-Object { Log $_ }
  Log (git status -sb 2>&1 | Out-String)
  Log 'done'
} catch {
  Log "ERROR: $($_.Exception.Message)"
  exit 1
}
