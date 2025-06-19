Write-Host "=== Docker Setup Test Script ===" -ForegroundColor Cyan
Write-Host "This script will help identify issues with your Docker setup."

# Check if Docker is installed
Write-Host "`n=== Checking Docker installation ===" -ForegroundColor Cyan
try {
    $dockerVersion = docker --version
    Write-Host "Docker is installed" -ForegroundColor Green
    Write-Host $dockerVersion
}
catch {
    Write-Host "Docker is not installed" -ForegroundColor Red
}

# Check if Docker Compose is installed
Write-Host "`n=== Checking Docker Compose installation ===" -ForegroundColor Cyan
try {
    $composeVersion = docker-compose --version
    Write-Host "Docker Compose is installed" -ForegroundColor Green
    Write-Host $composeVersion
}
catch {
    Write-Host "Docker Compose is not installed" -ForegroundColor Red
}

# Check if .env file exists in backend directory
Write-Host "`n=== Checking environment files ===" -ForegroundColor Cyan
if (Test-Path "./stock-event-analyzer-backend/.env") {
    Write-Host "Backend .env file exists" -ForegroundColor Green
} else {
    Write-Host "Backend .env file does not exist" -ForegroundColor Red
    Write-Host "Please create a .env file in the stock-event-analyzer-backend directory with:" -ForegroundColor Yellow
    Write-Host "OPENAI_API_KEY=your_key_here" -ForegroundColor Yellow
    Write-Host "ALPHA_VANTAGE_API_KEY=your_key_here" -ForegroundColor Yellow
    Write-Host "NEWS_API_KEY=your_key_here" -ForegroundColor Yellow
    Write-Host "JWT_SECRET=your_secret_here" -ForegroundColor Yellow
}

# Check if frontend is using correct API URL in Docker environment
Write-Host "`n=== Checking frontend API configuration ===" -ForegroundColor Cyan
$dockerComposeContent = Get-Content ./docker-compose.yml -Raw
if ($dockerComposeContent -match "NEXT_PUBLIC_API_URL=http://backend:4000") {
    Write-Host "Frontend is configured to use backend service in docker-compose.yml" -ForegroundColor Green
} else {
    Write-Host "Frontend is not properly configured to use backend service" -ForegroundColor Red
    Write-Host "Please update NEXT_PUBLIC_API_URL to 'http://backend:4000' in docker-compose.yml" -ForegroundColor Yellow
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "To fix your Docker setup:" -ForegroundColor White
Write-Host "1. Make sure all required environment variables are set in stock-event-analyzer-backend/.env" -ForegroundColor White
Write-Host "2. Ensure frontend uses 'http://backend:4000' as API URL in Docker environment" -ForegroundColor White
Write-Host "3. Make sure API endpoints in frontend match those defined in backend:" -ForegroundColor White
Write-Host "   - Backend has: /api/sp500-data, /api/historical-event, /api/news-articles" -ForegroundColor White
Write-Host "4. Rebuild your containers with: docker-compose up --build" -ForegroundColor White 