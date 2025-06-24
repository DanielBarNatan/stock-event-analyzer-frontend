Stock Event Analyzer

*What is this app and why use it?*
Stock Event Analyzer helps you instantly discover how major historical events impacted the S&P 500 and the broader market. Enter any event (like "2008 financial crisis"), and the app finds the event, explains its significance, and shows how the S&P 500 performed in the days, weeks, and months after. This is perfect for investors, students, and anyone curious about the relationship between news and the stock market. The app is fast, easy to use, and combines AI-powered event analysis with real market data for unique insights.

 *Tech Stack*
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** 
  - Node.js, Express.js (for authentication and main API)
  - FastAPI (Python) for historical events processing
- **Database:** SQLite (for user/auth data)
- **APIs:**
  - OpenAI (for event analysis)
  - Alpha Vantage (for S&P 500 data)
  - NewsAPI (for related news articles)
- **Authentication:** JWT (JSON Web Tokens)
- **Containerization:** Docker, Docker Compose

- *How to Run the App*

1. Run with Docker (Production)
1. Make sure you have Docker and Docker Compose installed and docker desktop is up.
2. Create a `.env` file in the project root with API keys:
   ```env
   OPENAI_API_KEY=your_openai_key
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   NEWS_API_KEY=your_newsapi_key
   JWT_SECRET=your_jwt_secret
   ```
3. In the project root, run:

 ## docker-compose up --build

4. Access the app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - FastAPI Service: http://localhost:8000

- Run Locally (Without Docker)
1. **Backend (Node.js):**
   - Open a terminal in `stock-event-analyzer-backend`
   - Install dependencies: `npm install`
   - Create a `.env` file with API keys (see above)
   - Start the server: `npm start`
2. **FastAPI Backend:**
   - Open a terminal in `stock-event-analyzer-fastapi`
   - Create a virtual environment: `python -m venv venv`
   - Activate the virtual environment:
     - Windows: `venv\Scripts\activate`
     - macOS/Linux: `source venv/bin/activate`
   - Install dependencies: `pip install -r requirements.txt`
   - Start the server: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
3. **Frontend:**
   - Open a terminal in `stock-event-analyzer-frontend`
   - Install dependencies: `npm install`
   - Start the app: `npm run dev`
4. Access the app at http://localhost:3000

---
- The Node.js backend runs on port 4000, the FastAPI backend runs on port 8000, and the frontend on port 3000.
- Make sure the API keys are set in the `.env` file.


 - *How It Works*
1. Search for any historical event on the "Historical Events" tab
2. The app automatically switches to "S&P 500 Charts" tab
3. Event date is pre-filled and stock data loads automatically
4. View market performance for 1 week, 1 month, 3 months, and 6 months after the event

- *Project Structure*
```
SMP/
├── stock-event-analyzer-frontend/  # Next.js frontend application
├── stock-event-analyzer-backend/   # Node.js/Express backend for auth and main API
├── stock-event-analyzer-fastapi/   # Python FastAPI service for historical events
│   ├── app/
│   │   ├── api/                   # API endpoints
│   │   ├── core/                  # Core configurations
│   │   ├── services/              # Business logic services
│   │   └── main.py                # FastAPI application entry point
│   ├── Dockerfile                 # Docker configuration for FastAPI
│   └── requirements.txt           # Python dependencies
├── tests/                         # Integration and unit tests
├── .env                           # Environment variables
├── .gitignore
├── docker-compose.yml             # Docker Compose configuration
├── package-lock.json
├── package.json
└── README.md
```

- *API Keys Required*
- OpenAI API Key (configured in backend and FastAPI service)
- Alpha Vantage API Key (configured in backend)
- NEWS API KEY (configured in backend)

- *Important Notes*
- Always run servers from their respective directories
- Frontend runs on port 3000, Node.js backend runs on port 4000, FastAPI runs on port 8000
- If you get package.json errors, make sure you're in the correct directory
- The FastAPI service provides historical event analysis through the `/api/historical-event` endpoint 