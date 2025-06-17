# Docker Troubleshooting Guide

This guide helps you resolve common issues with the Stock Event Analyzer Docker setup.

## 404 Not Found Errors

If you're seeing 404 errors when trying to fetch data from the API, there are several potential causes:

### 1. Environment Variables

Make sure you have a proper `.env` file in the `stock-event-analyzer-backend` directory with all required API keys:

```
OPENAI_API_KEY=your_openai_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
NEWS_API_KEY=your_news_api_key_here
JWT_SECRET=your_jwt_secret_here
PORT=4000
```

### 2. Container Communication

In Docker, containers need to reference each other by service name, not localhost. We've updated the Docker configuration to use `http://backend:4000` instead of `http://localhost:4000`.

### 3. API Endpoint Mismatch

We've fixed the endpoint mismatch in the frontend code. The frontend now uses:
- `/api/news-articles` instead of `/api/news`
- `/api/sp500-data?startDate=` instead of `/api/stock-data?date=`

### 4. Rebuild the Containers

After making these changes, rebuild your containers:

```bash
docker-compose down
docker-compose up --build
```

## Testing Your Setup

Run the `test-docker-setup.sh` script to check for common issues:

```bash
chmod +x test-docker-setup.sh
./test-docker-setup.sh
```

## Checking Logs

To check logs for errors:

```bash
# View all logs
docker-compose logs

# View only backend logs
docker-compose logs backend

# View only frontend logs
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Manual Testing API Endpoints

You can test the backend API endpoints directly:

```bash
# Test the backend health check
curl http://localhost:4000

# Test the historical event endpoint
curl "http://localhost:4000/api/historical-event?query=2008%20Financial%20Crisis"

# Test the stock data endpoint
curl "http://localhost:4000/api/sp500-data?startDate=2008-09-15"

# Test the news articles endpoint
curl "http://localhost:4000/api/news-articles?query=Financial%20Crisis"
```

If these endpoints return proper data when called directly, but still fail from the frontend, it's likely a network or CORS issue. 