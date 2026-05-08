@echo off
REM Deployment Script for rice-export.github.io
REM This script pushes all changes to GitHub Pages

echo.
echo ========================================
echo  ORIZA PLATFORM DEPLOYMENT SCRIPT
echo  Deploying to rice-export.github.io
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Git is not installed or not in PATH
    echo Visit: https://git-scm.com/download/win
    exit /b 1
)

REM Navigate to project directory
cd /d "%~dp0"
echo 📁 Working directory: %cd%

REM Check if we're in a git repository
if not exist .git (
    echo ❌ ERROR: Not in a git repository
    echo Run: git init
    exit /b 1
)

echo.
echo 📋 Git Status:
git status --short
echo.

REM Ask for commit message
set /p COMMIT_MSG="Enter commit message (or press Enter for default): "
if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=🚀 Deploy: Update Oriza Platform
)

echo.
echo 🔄 Starting deployment...
echo.

REM Add all files
echo ⏳ Adding files...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to add files
    exit /b 1
)
echo ✅ Files added

REM Check if there are changes to commit
git diff-index --quiet --cached HEAD
if %ERRORLEVEL% EQU 0 (
    echo ℹ️  No changes to commit
    echo Working directory is clean
    goto :check_ahead
)

REM Create commit
echo ⏳ Creating commit: "%COMMIT_MSG%"
git commit -m "%COMMIT_MSG%"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create commit
    exit /b 1
)
echo ✅ Commit created

:check_ahead
REM Push to GitHub
echo ⏳ Pushing to GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to push to GitHub
    echo Try:
    echo   git pull origin main
    echo   Then run this script again
    exit /b 1
)
echo ✅ Pushed to GitHub

echo.
echo ========================================
echo ✅ DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo 📊 Monitor deployment:
echo    https://github.com/rice-export/rice-export.github.io/actions
echo.
echo 🌐 View live site (wait 2-3 minutes):
echo    https://rice-export.github.io
echo.
echo ⚙️  Backend deployment (if not done):
echo    See DEPLOY_NOW.md for instructions
echo.
pause
