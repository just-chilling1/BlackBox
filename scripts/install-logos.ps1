$ErrorActionPreference = 'Stop'
$assets = Join-Path $env:USERPROFILE '.cursor\projects\c-Users-gt-Desktop-blackbox\assets'
$wordmark = Join-Path $assets 'c__Users_gt_AppData_Roaming_Cursor_User_workspaceStorage_261f873debd3cd570c5c19f35e287803_images_NullPing-logo-removebg-preview-2e4be9af-e113-479b-8c6a-d27d3b144778.png'
$icon = Join-Path $assets 'c__Users_gt_AppData_Roaming_Cursor_User_workspaceStorage_261f873debd3cd570c5c19f35e287803_images_Mini-logo-removebg-preview-811d9ecd-52b3-49b5-b36d-dcb62aa68c9a.png'
$root = 'c:\Users\gt\Desktop\blackbox'
$public = Join-Path $root 'public'
$brand = Join-Path $root 'brand-assets'
New-Item -ItemType Directory -Force -Path $public, $brand | Out-Null

function Copy-Logo($src, $dest) {
  if (-not (Test-Path $src)) { throw "Missing source: $src" }
  Copy-Item -Force $src $dest
}

Copy-Logo $wordmark (Join-Path $public 'logo.png')
Copy-Logo $icon (Join-Path $public 'logo-icon.png')
Copy-Logo $wordmark (Join-Path $brand 'logo.png')
Copy-Logo $icon (Join-Path $brand 'logo-icon.png')
Copy-Logo $icon (Join-Path $public 'favicon.png')
Copy-Logo $icon (Join-Path $public 'apple-touch-icon.png')

$report = @(
  (Join-Path $public 'logo.png'),
  (Join-Path $public 'logo-icon.png'),
  (Join-Path $brand 'logo.png'),
  (Join-Path $brand 'logo-icon.png'),
  (Join-Path $public 'favicon.png'),
  (Join-Path $public 'apple-touch-icon.png')
) | ForEach-Object {
  if (Test-Path $_) {
    $i = Get-Item $_
    "$($i.FullName) $($i.Length) bytes"
  } else {
    "$_ MISSING"
  }
}

$reportText = ($report -join "`n") + "`n"
Set-Content -Path (Join-Path $root 'scripts\logo-install-report.txt') -Value $reportText -Encoding UTF8

# Also write base64 fallbacks
[Convert]::ToBase64String([IO.File]::ReadAllBytes($wordmark)) | Set-Content (Join-Path $brand 'logo.b64') -Encoding ASCII
[Convert]::ToBase64String([IO.File]::ReadAllBytes($icon)) | Set-Content (Join-Path $brand 'logo-icon.b64') -Encoding ASCII

Write-Output $reportText
