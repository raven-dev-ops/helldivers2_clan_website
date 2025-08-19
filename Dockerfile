# Use official Node image
FROM node:22.12.0-alpine

# Set working directory
WORKDIR /app

# Silence Node deprecation warnings
ENV NODE_OPTIONS=--no-deprecation

# Install all dependencies with clean cache
COPY package*.json ./
RUN npm ci

# Copy all app files
COPY . .

# Lint and build the Next.js app then remove dev dependencies
RUN npm run lint && npm run build && npm prune --omit=dev

# Set production environment for runtime
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
