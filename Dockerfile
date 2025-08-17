# Use official Node image
FROM node:18.18.2-alpine

# Set working directory
WORKDIR /app

# Install dependencies with clean cache
COPY package*.json ./
RUN npm ci

# Copy all app files
COPY . .

# Build the Next.js app
RUN npm run lint && npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
