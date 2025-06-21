# Use a specific Node.js base image
FROM node:18.18.2-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Install project dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port (default for Next.js)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
