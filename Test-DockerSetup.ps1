Write-Host "=== Docker Setup Test Script ===" -ForegroundColor Cyan
Write-Host "This script will help identify issues with your Docker setup."

# Check if Docker is installed
Write-Host "`n=== Checking Docker installation ===" -ForegroundColor Cyan
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker is installed" -ForegroundColor Green
    Write-Host $dockerVersion
}
catch {
    Write-Host "✗ Docker is not installed" -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
Write-Host "`n=== Checking Docker Compose installation ===" -ForegroundColor Cyan
try {
    $composeVersion = docker-compose --version
    Write-Host "✓ Docker Compose is installed" -ForegroundColor Green
    Write-Host $composeVersion
}
catch {
    Write-Host "✗ Docker Compose is not installed" -ForegroundColor Red
    exit 1
}

# Check if .env file exists in backend directory
Write-Host "`n=== Checking environment files ===" -ForegroundColor Cyan
$envPath = "./stock-event-analyzer-backend/.env"
if (Test-Path $envPath) {
    Write-Host "✓ Backend .env file exists" -ForegroundColor Green
    
    # Check if required environment variables are set
    Write-Host "`n=== Checking required environment variables ===" -ForegroundColor Cyan
    $requiredVars = @("OPENAI_API_KEY", "ALPHA_VANTAGE_API_KEY", "NEWS_API_KEY", "JWT_SECRET")
    $missingVars = @()
    
    $envContent = Get-Content $envPath
    
    foreach ($var in $requiredVars) {
        $found = $false
        foreach ($line in $envContent) {
            if ($line -match "^$var=") {
                $found = $true
                break
            }
        }
        
        if ($found) {
            Write-Host "✓ $var is set" -ForegroundColor Green
        } else {
            Write-Host "✗ $var is missing" -ForegroundColor Red
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Host "`n⚠️  Missing environment variables. Please add them to your .env file." -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Backend .env file does not exist" -ForegroundColor Red
    Write-Host "Creating example .env file..." -ForegroundColor Yellow
    
    $exampleEnvContent = @"
OPENAI_API_KEY=your_openai_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
NEWS_API_KEY=your_news_api_key_here
JWT_SECRET=your_jwt_secret_here
PORT=4000
"@
    
    $exampleEnvContent | Out-File -FilePath "./stock-event-analyzer-backend/.env.example" -Encoding utf8
    Write-Host "Created .env.example file. Please rename it to .env and add your API keys." -ForegroundColor Yellow
}

# Check if frontend is using correct API URL in Docker environment
Write-Host "`n=== Checking frontend API configuration ===" -ForegroundColor Cyan
$dockerComposeContent = Get-Content ./docker-compose.yml -Raw
if ($dockerComposeContent -match "NEXT_PUBLIC_API_URL=http://backend:4000") {
    Write-Host "✓ Frontend is configured to use backend service in docker-compose.yml" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend is not properly configured to use backend service" -ForegroundColor Red
    Write-Host "  Please update NEXT_PUBLIC_API_URL to 'http://backend:4000' in docker-compose.yml" -ForegroundColor Yellow
}

# Check network connectivity between containers
Write-Host "`n=== Testing network connectivity ===" -ForegroundColor Cyan
$networks = docker network ls
if ($networks -match "stock-event-network") {
    Write-Host "✓ Docker network exists" -ForegroundColor Green
} else {
    Write-Host "✗ Docker network does not exist yet (will be created when running docker-compose)" -ForegroundColor Yellow
}

# Check API endpoint mismatch
Write-Host "`n=== Checking API endpoint mismatch ===" -ForegroundColor Cyan
$stockAnalyzerPath = "./stock-event-analyzer-frontend/components/StockAnalyzer.tsx"
if (Test-Path $stockAnalyzerPath) {
    $stockAnalyzerContent = Get-Content $stockAnalyzerPath -Raw
    
    # Check news endpoint
    if ($stockAnalyzerContent -match "/api/news-articles") {
        Write-Host "✓ Frontend is using /api/news-articles endpoint" -ForegroundColor Green
    } elseif ($stockAnalyzerContent -match "/api/news") {
        Write-Host "✗ Frontend is using /api/news but should use /api/news-articles" -ForegroundColor Red
    } else {
        Write-Host "? Could not determine news API endpoint usage" -ForegroundColor Yellow
    }
    
    # Check stock data endpoint
    if ($stockAnalyzerContent -match "/api/sp500-data") {
        Write-Host "✓ Frontend is using /api/sp500-data endpoint" -ForegroundColor Green
    } elseif ($stockAnalyzerContent -match "/api/stock-data") {
        Write-Host "✗ Frontend is using /api/stock-data but should use /api/sp500-data" -ForegroundColor Red
    } else {
        Write-Host "? Could not determine stock data API endpoint usage" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Could not find StockAnalyzer.tsx file" -ForegroundColor Red
}

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "To fix your Docker setup:" -ForegroundColor White
Write-Host "1. Make sure all required environment variables are set in stock-event-analyzer-backend/.env" -ForegroundColor White
Write-Host "2. Ensure frontend uses 'http://backend:4000' as API URL in Docker environment" -ForegroundColor White
Write-Host "3. Make sure API endpoints in frontend match those defined in backend:" -ForegroundColor White
Write-Host "   - Backend has: /api/sp500-data, /api/historical-event, /api/news-articles" -ForegroundColor White
Write-Host "   - Frontend should use these exact paths" -ForegroundColor White
Write-Host "`nTo run the application:" -ForegroundColor White
Write-Host "1. Stop any running containers: docker-compose down" -ForegroundColor White
Write-Host "2. Rebuild and start: docker-compose up --build" -ForegroundColor White
Write-Host "3. Check logs for errors: docker-compose logs" -ForegroundColor White 