$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host "Starting Course Rec Application..." -ForegroundColor Cyan

# Start Python API
Write-Host "Starting Flask API in a new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location '$projectRoot'; python api.py`""

# Start Frontend
Write-Host "Starting Vite React Frontend in a new window..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location '$projectRoot\frontend'; npm run dev`""

Write-Host "Startup scripts triggered!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: Typically http://localhost:5173"
Write-Host "Keep the new terminal windows open to continue running the application." -ForegroundColor Gray
