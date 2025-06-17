# Environment Variables Setup

## Single .env File Configuration

This project uses a single `.env` file approach. The main `.env` file should be placed in the root directory only, and both the frontend and backend are configured to use this single file.

## Setup Instructions

1. Create a `.env` file in the project root directory with the following variables:

```
# API Keys
OPENAI_API_KEY=your_openai_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
NEWS_API_KEY=your_news_api_key_here

# Security
JWT_SECRET=your_jwt_secret_here

# Server configuration
PORT=4000

# Frontend specific variables
NEXT_PUBLIC_API_URL=http://localhost:4000
```

That's it! You only need this one file in the root directory.

## API URL Configuration

The `NEXT_PUBLIC_API_URL` environment variable is crucial for proper communication between the frontend and backend:

- **Local Development**: Use `http://localhost:4000`
- **Docker Development**: Use `http://backend:4000` (container name)
- **Production**: Use your actual backend URL (e.g., `https://api.yourapp.com`)

The application has been updated to intelligently handle different environments:
1. It first checks for the `NEXT_PUBLIC_API_URL` environment variable
2. If not found, it uses the current hostname with port 4000
3. As a last resort, it falls back to `http://localhost:4000`

## How It Works

- **Backend**: The Express.js backend has been configured to look for the `.env` file in the parent directory (project root).
- **Docker**: The Docker Compose files have been configured to mount the root `.env` file for both services.

## Docker Configuration

When running with Docker, the root `.env` file is mounted into both containers:

```
docker-compose up --build
```

For development with live reloading:

```
docker-compose -f docker-compose.dev.yml up --build
```

## Troubleshooting

If you encounter issues with environment variables not being loaded:

1. Make sure the `.env` file exists in the root directory
2. Verify that the variables are correctly formatted (no spaces around the = sign)
3. Restart your application or Docker containers

### Common API Connection Issues

If you see "Failed to fetch" errors:
1. Check that your `NEXT_PUBLIC_API_URL` is correctly set
2. For Docker: make sure it's set to `http://backend:4000`
3. For local development: make sure the backend is running on port 4000
4. Check for CORS issues in your browser's developer console 