FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

# Set environment variables for production
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://backend:4000

# Make sure we have the correct Tailwind config
RUN rm -f tailwind.config.js
RUN rm -f postcss.config.js

# Copy the correct Tailwind config files
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Ensure Tailwind CSS is properly initialized and processed
RUN npx tailwindcss init -p --force

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]