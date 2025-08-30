# Galactic Phantom Division Website

This is the repository for the Galactic Phantom Division website. It is a Next.js application built with TypeScript and styled-components, featuring user authentication with NextAuth.js and MongoDB.

## Recent Updates

- Centered navigation bar text and added Super Store link under the Intel menu.
- Added auto-playing background music with volume control and visible song credits.
- Introduced tabbed leaderboards, merch shop disclaimer, and new profile tabs for roles, awards, squad, and rankings.
- Exposed merit points across the site and added a rotating alert bar beneath the navigation.

## Features

- **Next.js Framework:** Leverages the power of Next.js for server-side rendering, routing, and API routes.
- **TypeScript:** Provides static typing for improved code quality and maintainability.
- **Styled Components:** Utilizes styled-components for styling with CSS-in-JS.
- **NextAuth.js:** Handles user authentication, including social login providers like Discord (configured). NextAuth.js automatically manages the Discord OAuth2 flow, so you don't need to manually construct authorization URLs.
- **MongoDB Integration:** Connects to a MongoDB database for data storage (using Mongoose).
- **Particle Effects:** Incorporates `tsparticles` for interactive particle effects.
- **Swiper:** Uses Swiper for creating touch-enabled sliders.
- **ESLint:** Configured for code linting to maintain code style and prevent errors.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm
- MongoDB instance (local or hosted)
- Discord Developer account (for OAuth2 login)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/helldivers2_clan_website.git
   cd helldivers2_clan_website
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

### Environment Variables

Create a `.env.local` file in the project root and define the following variables:

```
MONGODB_URI=<your-mongodb-connection-string>
MONGODB_DB=<database-name>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-a-secret-key>
DISCORD_CLIENT_ID=<discord-client-id>
DISCORD_CLIENT_SECRET=<discord-client-secret>
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10
REDIS_URL=redis://localhost:6379
```

### Discord OAuth Scopes

When configuring your Discord application, ensure the OAuth scopes include:

- `identify`
- `guilds`
- `guilds.members.read`

These scopes are required for Discord authentication and guild access.

### Local Development

After installing dependencies and setting environment variables, start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Testing

Run the test suite with:

```bash
pnpm test
```

### Deployment

Build the production bundle and start the server:

```bash
pnpm build
pnpm start
```

Ensure that the same environment variables are configured in your hosting environment.
