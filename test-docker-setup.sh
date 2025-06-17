#!/bin/bash

echo "=== Docker Setup Test Script ==="
echo "This script will help identify issues with your Docker setup."

# Check if Docker is installed
echo -e "\n=== Checking Docker installation ==="
if command -v docker &> /dev/null; then
    echo "✓ Docker is installed"
    docker --version
else
    echo "✗ Docker is not installed"
    exit 1
fi

# Check if Docker Compose is installed
echo -e "\n=== Checking Docker Compose installation ==="
if command -v docker-compose &> /dev/null; then
    echo "✓ Docker Compose is installed"
    docker-compose --version
else
    echo "✗ Docker Compose is not installed"
    exit 1
fi

# Check if .env file exists in backend directory
echo -e "\n=== Checking environment files ==="
if [ -f "./stock-event-analyzer-backend/.env" ]; then
    echo "✓ Backend .env file exists"
    
    # Check if required environment variables are set
    echo -e "\n=== Checking required environment variables ==="
    required_vars=("OPENAI_API_KEY" "ALPHA_VANTAGE_API_KEY" "NEWS_API_KEY" "JWT_SECRET")
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" ./stock-event-analyzer-backend/.env; then
            echo "✓ $var is set"
        else
            echo "✗ $var is missing"
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo -e "\n⚠️  Missing environment variables. Please add them to your .env file."
    fi
else
    echo "✗ Backend .env file does not exist"
    echo "Creating example .env file..."
    cat > ./stock-event-analyzer-backend/.env.example << EOL
OPENAI_API_KEY=your_openai_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
NEWS_API_KEY=your_news_api_key_here
JWT_SECRET=your_jwt_secret_here
PORT=4000
EOL
    echo "Created .env.example file. Please rename it to .env and add your API keys."
fi

# Check if frontend is using correct API URL in Docker environment
echo -e "\n=== Checking frontend API configuration ==="
if grep -q "NEXT_PUBLIC_API_URL=http://backend:4000" docker-compose.yml; then
    echo "✓ Frontend is configured to use backend service in docker-compose.yml"
else
    echo "✗ Frontend is not properly configured to use backend service"
    echo "  Please update NEXT_PUBLIC_API_URL to 'http://backend:4000' in docker-compose.yml"
fi

# Check network connectivity between containers
echo -e "\n=== Testing network connectivity ==="
if docker network ls | grep -q "stock-event-network"; then
    echo "✓ Docker network exists"
else
    echo "✗ Docker network does not exist yet (will be created when running docker-compose)"
fi

echo -e "\n=== Checking API endpoint mismatch ==="
# Check if frontend is calling the correct API endpoints
if grep -q "/api/news-articles" ./stock-event-analyzer-frontend/components/StockAnalyzer.tsx; then
    echo "✗ Frontend is using /api/news-articles but should use /api/news"
else
    if grep -q "/api/news" ./stock-event-analyzer-frontend/components/StockAnalyzer.tsx; then
        echo "✓ Frontend is using /api/news endpoint"
    else
        echo "? Could not determine news API endpoint usage"
    fi
fi

if grep -q "/api/stock-data" ./stock-event-analyzer-frontend/components/StockAnalyzer.tsx; then
    echo "✗ Frontend is using /api/stock-data but should use /api/sp500-data"
else
    if grep -q "/api/sp500-data" ./stock-event-analyzer-frontend/components/StockAnalyzer.tsx; then
        echo "✓ Frontend is using /api/sp500-data endpoint"
    else
        echo "? Could not determine stock data API endpoint usage"
    fi
fi

echo -e "\n=== Summary ==="
echo "To fix your Docker setup:"
echo "1. Make sure all required environment variables are set in stock-event-analyzer-backend/.env"
echo "2. Ensure frontend uses 'http://backend:4000' as API URL in Docker environment"
echo "3. Make sure API endpoints in frontend match those defined in backend:"
echo "   - Backend has: /api/sp500-data, /api/historical-event, /api/news-articles"
echo "   - Frontend should use these exact paths"
echo -e "\nTo run the application:"
echo "1. Stop any running containers: docker-compose down"
echo "2. Rebuild and start: docker-compose up --build"
echo "3. Check logs for errors: docker-compose logs" 