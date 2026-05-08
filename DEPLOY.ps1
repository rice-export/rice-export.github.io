#!/usr/bin/env pwsh

# Deployment Script for rice-export.github.io
# PowerShell version

Write-Host "`n"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " ORIZA PLATFORM DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host " Deploying to rice-export.github.io" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

# Check if git is installed
try {
    $null = git --version
} catch {
    Write-Host "❌ ERROR: Git is not installed" -ForegroundColor Red
    Write-Host "Visit: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Navigate to script directory
$scriptPath = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Set-Location $scriptPath
Write-Host "📁 Working directory: $(Get-Location)" -ForegroundColor Cyan

# Check if in git repository
if (-not (Test-Path -Path .git)) {
    Write-Host "❌ ERROR: Not in a git repository" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Git Status:" -ForegroundColor Cyan
git status --short

Write-Host "`n"
$commitMsg = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "🚀 Deploy: Update Oriza Platform"
}

Write-Host "`n🔄 Starting deployment..." -ForegroundColor Cyan
Write-Host ""

# Add all files
Write-Host "⏳ Adding files..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to add files" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Files added" -ForegroundColor Green

# Check if there are changes to commit
$hasDiff = git diff-index --quiet --cached HEAD; $hasDiff
if ($LASTEXITCODE -eq 0) {
    Write-Host "ℹ️  No changes to commit - working directory is clean" -ForegroundColor Yellow
} else {
    # Create commit
    Write-Host "⏳ Creating commit: `"$commitMsg`"" -ForegroundColor Yellow
    git commit -m "$commitMsg"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create commit" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Commit created" -ForegroundColor Green
}

# Push to GitHub
Write-Host "⏳ Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Try:" -ForegroundColor Yellow
    Write-Host "  git pull origin main" -ForegroundColor Yellow
    Write-Host "  Then run this script again" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Pushed to GitHub" -ForegroundColor Green

Write-Host "`n"
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`n"

Write-Host "📊 Monitor deployment:" -ForegroundColor Cyan
Write-Host "   https://github.com/rice-export/rice-export.github.io/actions" -ForegroundColor Blue

Write-Host "`n🌐 View live site (wait 2-3 minutes):" -ForegroundColor Cyan
Write-Host "   https://rice-export.github.io" -ForegroundColor Blue

Write-Host "`n⚙️  Backend deployment (if not done):" -ForegroundColor Cyan
Write-Host "   See DEPLOY_NOW.md for instructions" -ForegroundColor Blue
Write-Host "`n"
