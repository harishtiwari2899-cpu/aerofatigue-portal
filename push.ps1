$env:PATH = "C:\Users\USER\.gemini\antigravity\tools\git\cmd;$env:PATH"
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Pushing AeroFatigue to GitHub Repository... " -ForegroundColor Cyan
Write-Host " Repo: https://github.com/harishtiwari2899-cpu/aerofatigue-portal" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan
git status
git push -u origin main
Write-Host "`nDone!" -ForegroundColor Green
