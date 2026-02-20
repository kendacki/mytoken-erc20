# PowerShell script to help add Smart Contract User Rule to Cursor
# This script opens the User Rule file and provides instructions

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Adding Smart Contract Protocol to Cursor User Rules" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$ruleFile = Join-Path $scriptPath "USER-RULE-smart-contracts.txt"
$ruleContent = Get-Content $ruleFile -Raw

Write-Host "Rule content to add:" -ForegroundColor Yellow
Write-Host ""
Write-Host $ruleContent -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy the text above" -ForegroundColor White
Write-Host "2. Open Cursor" -ForegroundColor White
Write-Host "3. Press Ctrl+, to open Settings" -ForegroundColor White
Write-Host "4. Go to: Rules -> User Rules" -ForegroundColor White
Write-Host "5. Click Add Rule or edit existing rule" -ForegroundColor White
Write-Host "6. Paste the copied text" -ForegroundColor White
Write-Host "7. Save" -ForegroundColor White
Write-Host ""
Write-Host "Opening the rule file for you..." -ForegroundColor Green
Write-Host ""

# Copy to clipboard
$ruleContent | Set-Clipboard
Write-Host "Rule content copied to clipboard!" -ForegroundColor Green
Write-Host ""

# Open the file in default text editor
Start-Process notepad.exe -ArgumentList $ruleFile

Write-Host "The rule file is now open. The content is also in your clipboard." -ForegroundColor Green
Write-Host "Follow the steps above to add it to Cursor User Rules." -ForegroundColor Green
