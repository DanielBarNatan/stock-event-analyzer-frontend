const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Log environment variables for debugging (remove in production)
console.log('Environment variables loaded:', {
  OPENAI_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
  ALPHA_KEY_EXISTS: !!process.env.ALPHA_VANTAGE_API_KEY,
  NEWS_API_KEY_EXISTS: !!process.env.NEWS_API_KEY,
  PORT: process.env.PORT
});

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Stock Event Analyzer API is running!' });
});

// Helper function to calculate dates
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Helper function to filter data by date range
function filterDataByDateRange(data, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return Object.entries(data)
    .filter(([date]) => {
      const currentDate = new Date(date);
      return currentDate >= start && currentDate <= end;
    })
    .map(([date, values]) => ({
      date,
      close: parseFloat(values['4. close'])
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Alpha Vantage API route for S&P 500 data
app.get('/api/sp500-data', async (req, res) => {
  try {
    const { startDate } = req.query;
    
    if (!startDate) {
      return res.status(400).json({ error: 'startDate parameter is required (YYYY-MM-DD format)' });
    }

    if (!process.env.ALPHA_VANTAGE_API_KEY) {
      console.error('Alpha Vantage API key not found in environment');
      return res.status(500).json({ error: 'Alpha Vantage API key not configured' });
    }

    // Log the API key being used (but mask most of it)
    const maskedKey = process.env.ALPHA_VANTAGE_API_KEY.slice(0, 4) + '...' + process.env.ALPHA_VANTAGE_API_KEY.slice(-4);
    console.log('Using Alpha Vantage API key:', maskedKey);

    // Fetch S&P 500 data from Alpha Vantage
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${process.env.ALPHA_VANTAGE_API_KEY}&outputsize=full`;
    
    console.log('Making request to Alpha Vantage API...');
    const response = await axios.get(apiUrl);
    
    console.log('Response received from Alpha Vantage');
    console.log('Response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));

    const data = response.data;

    if (data['Error Message']) {
      console.error('Alpha Vantage error:', data['Error Message']);
      return res.status(400).json({ error: 'Invalid symbol or API error' });
    }

    if (data['Note']) {
      console.error('Alpha Vantage rate limit:', data['Note']);
      return res.status(429).json({ error: 'API call frequency limit reached. Please try again later.' });
    }

    const timeSeriesData = data['Time Series (Daily)'];
    if (!timeSeriesData) {
      console.error('No time series data in response. Available data:', Object.keys(data));
      return res.status(500).json({ error: 'No time series data available' });
    }

    // Log available dates
    const availableDates = Object.keys(timeSeriesData);
    console.log('Data available from', availableDates[availableDates.length - 1], 'to', availableDates[0]);
    console.log('Requested date:', startDate);

    const start = new Date(startDate);
    const oneWeekEnd = addDays(start, 7);
    const oneMonthEnd = addDays(start, 30);
    const threeMonthsEnd = addDays(start, 90);
    const sixMonthsEnd = addDays(start, 180);

    // Filter data for each time period
    const oneWeek = filterDataByDateRange(timeSeriesData, start, oneWeekEnd);
    const oneMonth = filterDataByDateRange(timeSeriesData, start, oneMonthEnd);
    const threeMonths = filterDataByDateRange(timeSeriesData, start, threeMonthsEnd);
    const sixMonths = filterDataByDateRange(timeSeriesData, start, sixMonthsEnd);

    // Log data points found
    console.log('Data points found:', {
      oneWeek: oneWeek.length,
      oneMonth: oneMonth.length,
      threeMonths: threeMonths.length,
      sixMonths: sixMonths.length
    });

    res.json({
      symbol: 'SPY (S&P 500 ETF)',
      startDate,
      data: {
        oneWeek,
        oneMonth,
        threeMonths,
        sixMonths
      },
      metadata: {
        oneWeekCount: oneWeek.length,
        oneMonthCount: oneMonth.length,
        threeMonthsCount: threeMonths.length,
        sixMonthsCount: sixMonths.length
      }
    });

  } catch (error) {
    console.error('Alpha Vantage API error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch S&P 500 data' });
  }
});

// OpenAI route for historical events
app.get('/api/historical-event', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const prompt = `Based on the search query "${query}", find information about this specific historical event or the most directly related significant U.S. historical event. If the query mentions a specific event (like "2008 financial crisis", "great depression", "black monday", etc.), provide information about that exact event.\n\nIMPORTANT: For the date field, provide the MOST SPECIFIC date possible. Always try to provide the exact date (YYYY-MM-DD) when the event occurred or began. For example:\n- Black Monday: "1987-10-19" (not just "1987")\n- 2008 Financial Crisis: "2008-09-15" (Lehman Brothers collapse date)\n- Great Depression: "1929-10-29" (Black Tuesday)\n- Housing Crisis: "2007-06-15" (when it became evident)\n\nReturn ONLY a valid JSON object with the following structure:

{
  "event": "Brief event name that matches the search query",
  "date": "YYYY-MM-DD (exact date when the event occurred or began)",
  "influencers": ["Key person 1", "Key person 2"],
  "description": "Detailed description of what happened on this specific date",
  "reason": "Why this event matches the search query",
  "impact": "How this affected markets/economy starting from this date",
  "source": "General historical source or 'Historical records'"
}

Make sure the response is valid JSON only, no additional text. Focus on the specific event mentioned in the query, not just any related financial event.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a financial historian who provides accurate, structured data about specific U.S. historical events and their market impacts. When a user asks about a specific event, provide information about that exact event, including the precise date (YYYY-MM-DD format) when it occurred. Research the exact date the event happened or officially began. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.2,
    });

    const responseContent = completion.choices[0].message.content.trim();
    
    try {
      const eventData = JSON.parse(responseContent);
      res.json(eventData);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      res.status(500).json({ error: 'Failed to parse historical event data' });
    }

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to fetch historical event data' });
  }
});

// News API route for related articles
app.get('/api/news-articles', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    if (!process.env.NEWS_API_KEY) {
      return res.status(500).json({ error: 'News API key not configured' });
    }

    // Calculate date 30 days ago for the 'from' parameter
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const fromDateString = fromDate.toISOString().split('T')[0];

    // Fetch news articles from News API
    const newsApiUrl = `https://newsapi.org/v2/everything?` +
      `q=${encodeURIComponent(query)}` +
      `&from=${fromDateString}` +
      `&sortBy=relevancy` +
      `&language=en` +
      `&pageSize=1` +
      `&apiKey=${process.env.NEWS_API_KEY}`;
    
    const response = await axios.get(newsApiUrl, {
      headers: {
        'User-Agent': 'stock-event-analyzer/1.0'
      }
    });

    const data = response.data;

    if (data.status === 'error') {
      return res.status(400).json({ error: data.message || 'News API returned an error' });
    }

    if (!data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
      return res.status(404).json({ error: 'No articles found' });
    }

    // Get the first article
    const article = data.articles[0];

    // Return only one article
    res.json({
      query,
      totalResults: data.totalResults,
      article: {
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        url: article.url,
        source: article.source?.name || 'Unknown source',
        publishedAt: article.publishedAt || new Date().toISOString(),
        urlToImage: article.urlToImage || null
      }
    });

  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test the API`);
}); 

