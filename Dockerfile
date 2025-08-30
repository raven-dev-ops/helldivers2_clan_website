# Use official Node image
FROM node:22.12.0-alpine

# Set working directory
WORKDIR /app

# Silence Node deprecation warnings
ENV NODE_OPTIONS=--no-deprecation

# Enable Corepack and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copy all app files
COPY . .

# Lint and build the Next.js app then remove dev dependencies
RUN pnpm lint && pnpm build && pnpm prune --prod

# Set production environment for runtime
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
