# Stock Event Analyzer

A full-stack application that combines historical event search with S&P 500 market data visualization.

## 🚀 Quick Start

### Option 1: Easy Start (Recommended)
Double-click `start-app.bat` in the main SMP folder. This will:
- Start the backend server on port 4000
- Start the frontend server on port 3000
- Open both in separate command windows

### Option 2: Manual Start
1. **Start Backend:**
   - Open terminal in `stock-event-analyzer-backend` folder
   - Run: `npm start`

2. **Start Frontend:**
   - Open terminal in `stock-event-analyzer-frontend` folder  
   - Run: `npm run dev`

## 📱 Access the App
- **Frontend (Main App):** http://localhost:3000
- **Backend API:** http://localhost:4000

## 🛠 How It Works
1. Search for any historical event on the "Historical Events" tab
2. The app automatically switches to "S&P 500 Charts" tab
3. Event date is pre-filled and stock data loads automatically
4. View market performance for 1 week, 1 month, 3 months, and 6 months after the event

## 🔧 Project Structure
```
SMP/
├── stock-event-analyzer-frontend/  # Next.js React app
├── stock-event-analyzer-backend/   # Express.js API server
├── start-app.bat                   # Start both servers
├── start-frontend.bat              # Start frontend only
└── start-backend.bat               # Start backend only
```

## 🔑 API Keys Required
- OpenAI API Key (configured in backend)
- Alpha Vantage API Key (configured in backend)

## ⚠️ Important Notes
- Always run servers from their respective directories
- Frontend runs on port 3000, Backend runs on port 4000
- If you get package.json errors, make sure you're in the correct directory 