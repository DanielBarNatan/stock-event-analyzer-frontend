FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

# Create .env file template if it doesn't exist
RUN if [ ! -f .env ]; then echo "Creating .env.example file"; \
    echo "OPENAI_API_KEY=your_key_here\nALPHA_VANTAGE_API_KEY=your_key_here\nNEWS_API_KEY=your_key_here\nPORT=4000\nJWT_SECRET=your_secret_here" > .env.example; fi

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"] 