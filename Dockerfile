# Use official Node image
FROM node:22.12.0-alpine

# Set working directory
WORKDIR /app

# Set production environment and silence Node deprecation warnings
ENV NODE_ENV=production
ENV NODE_OPTIONS=--no-deprecation

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
