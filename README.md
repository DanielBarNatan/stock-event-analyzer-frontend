# Stock Event Analyzer

## What is this app and why use it?
Stock Event Analyzer helps you instantly discover how major historical events impacted the S&P 500 and the broader market. Enter any event (like "2008 financial crisis"), and the app finds the event, explains its significance, and shows how the S&P 500 performed in the days, weeks, and months after. This is perfect for investors, students, and anyone curious about the relationship between news and the stock market. The app is fast, easy to use, and combines AI-powered event analysis with real market data for unique insights.

## Tech Stack
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite (for user/auth data)
- **APIs:**
  - OpenAI (for event analysis)
  - Alpha Vantage (for S&P 500 data)
  - NewsAPI (for related news articles)
- **Authentication:** JWT (JSON Web Tokens)
- **Containerization:** Docker, Docker Compose

## How to Run the App

### 1. Run with Docker (Production)
1. Make sure you have Docker and Docker Compose installed.
2. Create a `.env` file in the project root with API keys:
   ```env
   OPENAI_API_KEY=your_openai_key
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   NEWS_API_KEY=your_newsapi_key
   JWT_SECRET=your_jwt_secret
   ```
3. In the project root, run:

 docker-compose up --build

4. Access the app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

### 2. Run Locally (Without Docker)
1. **Backend:**
   - Open a terminal in `stock-event-analyzer-backend`
   - Install dependencies: `npm install`
   - Create a `.env` file with API keys (see above)
   - Start the server: `npm start`
2. **Frontend:**
   - Open a terminal in `stock-event-analyzer-frontend`
   - Install dependencies: `npm install`
   - Start the app: `npm run dev`
3. Access the app at http://localhost:3000

---
- The backend runs on port 4000, the frontend on port 3000.
- Make sure the API keys are set in the `.env` file.


## 🛠 How It Works
1. Search for any historical event on the "Historical Events" tab
2. The app automatically switches to "S&P 500 Charts" tab
3. Event date is pre-filled and stock data loads automatically
4. View market performance for 1 week, 1 month, 3 months, and 6 months after the event

## 🔧 Project Structure
```
SMP/
├── stock-event-analyzer-frontend/
├── stock-event-analyzer-backend/
├── tests/
├── .env
├── .gitignore
├── CONTAINERIZATION-SUMMARY.md
├── docker-compose.dev.yml
├── docker-compose.yml
├── package-lock.json
├── package.json
├── README.md
└── roadmap.mp
```

## 🔑 API Keys Required
- OpenAI API Key (configured in backend)
- Alpha Vantage API Key (configured in backend)
- NEWS API KEY (configured in backend)

## ⚠️ Important Notes
- Always run servers from their respective directories
- Frontend runs on port 3000, Backend runs on port 4000
- If you get package.json errors, make sure you're in the correct directory 