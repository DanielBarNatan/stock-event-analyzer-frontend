# Docker Setup for Stock Event Analyzer

This guide explains how to run the Stock Event Analyzer application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine
- API keys for:
  - OpenAI API
  - Alpha Vantage API
  - News API

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/stock-event-analyzer.git
cd stock-event-analyzer
```

### 2. Set Up Environment Variables

Create a `.env` file in the `stock-event-analyzer-backend` directory with your API keys:

```bash
cd stock-event-analyzer-backend
```

Create a file named `.env` with the following content:

```
OPENAI_API_KEY=your_openai_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
NEWS_API_KEY=your_news_api_key_here
JWT_SECRET=a_secure_random_string_for_jwt
PORT=4000
```

Replace the placeholder values with your actual API keys.

### 3. Build and Run with Docker Compose

Navigate back to the root directory and run:

```bash
cd ..
docker-compose up --build
```

This command will:
- Build the Docker images for both frontend and backend
- Start the containers
- Set up the necessary network

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Stopping the Application

To stop the running containers:

```bash
docker-compose down
```

## Troubleshooting

### API Key Issues

If you encounter issues with API calls, ensure your API keys are correctly set in the `.env` file.

### Port Conflicts

If ports 3000 or 4000 are already in use on your machine, you can modify the `docker-compose.yml` file to use different ports:

```yaml
ports:
  - "3001:3000"  # Maps host port 3001 to container port 3000
```

### Container Logs

To view logs for debugging:

```bash
# View logs for all services
docker-compose logs

# View logs for a specific service
docker-compose logs frontend
docker-compose logs backend
```

## Development Workflow

For active development, you might want to mount your code as volumes to see changes without rebuilding:

```yaml
volumes:
  - ./stock-event-analyzer-frontend:/app
  # Exclude node_modules and .next
  - /app/node_modules
  - /app/.next
```

Add this to the `frontend` service in `docker-compose.yml` for development purposes. 