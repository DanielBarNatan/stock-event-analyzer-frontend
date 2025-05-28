require('dotenv').config();
const axios = require('axios');

async function testAlphaVantage() {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    console.log('API Key:', apiKey);
    
    try {
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=SPY&apikey=${apiKey}&outputsize=full`;
        console.log('Testing URL:', apiUrl);
        
        const response = await axios.get(apiUrl);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testAlphaVantage(); 