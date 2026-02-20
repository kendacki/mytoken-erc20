# Run this script after creating a new repository on GitHub.
# Usage: .\push-to-github.ps1
# Or:   .\push-to-github.ps1 -Username YOUR_GITHUB_USERNAME -Repo YOUR_REPO_NAME

param(
    [string]$Username = "",
    [string]$Repo = ""
)

$git = "C:\Program Files\Git\bin\git.exe"

if (-not $Username -or -not $Repo) {
    Write-Host "Create a new repo at https://github.com/new (no README, no .gitignore)." -ForegroundColor Cyan
    $Username = Read-Host "Enter your GitHub username"
    $Repo = Read-Host "Enter the repository name"
}

$url = "https://github.com/$Username/$Repo.git"
Write-Host "Adding remote: $url" -ForegroundColor Yellow
& $git remote add origin $url 2>&1
if ($LASTEXITCODE -ne 0) {
    & $git remote set-url origin $url
}
Write-Host "Pushing to main..." -ForegroundColor Yellow
& $git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "Done. Your code is at https://github.com/$Username/$Repo" -ForegroundColor Green
} else {
    Write-Host "Push failed. If you use 2FA, use a Personal Access Token as password, or set up SSH." -ForegroundColor Red
}
