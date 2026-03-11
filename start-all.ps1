# MSA 전체 서비스 실행 스크립트

Write-Host "🚀 Starting all MSA services..." -ForegroundColor Green

# Subway Service 실행
Write-Host "`n📍 Starting Subway Service (8081)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\gradlew.bat :subway-service:bootRun"

# Weather Service 실행
Write-Host "📍 Starting Weather Service (8082)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\gradlew.bat :weather-service:bootRun"

# API Gateway 실행
Write-Host "📍 Starting API Gateway (8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\gradlew.bat :api-gateway:bootRun"

# Frontend 실행
Write-Host "📍 Starting Frontend (3030)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`n✅ All services are starting in separate windows!" -ForegroundColor Green
Write-Host "Close this window after checking all services are running properly." -ForegroundColor Yellow
