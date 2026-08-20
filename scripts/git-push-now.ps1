$ErrorActionPreference = 'Stop'
Set-Location 'c:\Users\gt\Desktop\blackbox'
$log = Join-Path $PWD 'scripts\git-push-report.txt'

function Log($msg) { Add-Content -Path $log -Value $msg }

Remove-Item $log -ErrorAction SilentlyContinue
Log "started $(Get-Date -Format o)"

try {
  Log (git status -sb 2>&1 | Out-String)
  Log (git diff --stat 2>&1 | Out-String)

  git add next.config.ts package.json `
    public/logo.svg public/logo-icon.svg `
    scripts/copy-logos-now.mjs scripts/copy-logos.bat scripts/install-logos.mjs scripts/install-logos.ps1 `
    scripts/encode-logos-to-b64.mjs scripts/decode-logos-from-b64.mjs `
    src/config/brand.config.ts src/lib/brand-vars.ts `
    src/app/globals.css src/app/layout.tsx src/app/manifest.ts `
    src/components/layout/BrandLogo.tsx src/components/layout/AuthLayout.tsx `
    src/components/ui/particle-background.tsx `
    src/app/api/pins/[pinId]/image/route.ts `
    src/features/money-page/pages/ActivatePage.tsx `
    src/features/results/pages/ResultsPage.tsx `
    src/app/api/results/route.ts `
    src/app/api/pins/generate/route.ts `
    src/features/traffic/lib/pin-images.ts `
    src/features/traffic/lib/pin-images.test.ts `
    src/components/layout/Sidebar.tsx `
    src/components/layout/sidebar-nav-styles.ts `
    src/features/blog-builder/components/BlogBuilderNav.tsx `
    src/components/ui/workflow-page.tsx `
    src/lib/video-thumbnails.ts `
    src/lib/dashboard-content.ts `
    src/components/ui/video-thumbnail.tsx `
    src/components/premium/PremiumVideoTutorial.tsx 2>&1 | Out-String | ForEach-Object { Log $_ }

  $status = git status --porcelain 2>&1 | Out-String
  Log "after add:`n$status"

  $commitMsg = @'
Add NullPing logo assets and dark theme aligned to brand palette.

Includes logo install scripts, cyan-blue-purple UI tokens, and related page/API updates.
'@

  git commit -m $commitMsg 2>&1 | Out-String | ForEach-Object { Log $_ }
  Log (git log -1 --oneline 2>&1 | Out-String)
  git push -u origin HEAD 2>&1 | Out-String | ForEach-Object { Log $_ }
  Log (git status -sb 2>&1 | Out-String)
  Log (git remote get-url origin 2>&1 | Out-String)
  Log 'done'
} catch {
  Log "ERROR: $($_.Exception.Message)"
  exit 1
}
