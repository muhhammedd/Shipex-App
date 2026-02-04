# Deployment Guide

This guide details how to build and deploy the Shipex application to production environments.

## 🏗 Build Process

The application is built using Next.js.

### 1. Build Command
```bash
npm run build
```
This command:
- Compiles TypeScript code.
- Optimizes images.
- Generates static pages (SSG).
- Compiles server-side endpoints (API Routes).

### 2. Output
The build output is located in the `.next` directory. The explicit `out` directory is not used by default unless `output: 'export'` is configured, but Shipex uses server features (API routes), so standard build is required.

## 🌍 Environment Variables

Create a `.env.local` (for local) or configure these in your CI/CD provider for production.

```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://shipex.com

# API Configuration
NEXT_PUBLIC_API_URL=https://api.shipex.com/v1
NEXT_PUBLIC_WS_URL=wss://api.shipex.com

# Authentication (If using NextAuth or custom)
NEXTAUTH_URL=https://shipex.com
NEXTAUTH_SECRET=your-secret-key

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXXXXXX
```

## 🚀 Vercel Deployment (Recommended)

Shipex is optimized for Vercel.

1.  **Push to GitHub**: Ensure your code is on the `main` branch.
2.  **Import Project**: Go to Vercel Dashboard -> Add New -> Project -> Import from GitHub.
3.  **Configure Project**:
    - **Framework Preset**: Next.js
    - **Root Directory**: `./`
    - **Environment Variables**: Add the variables listed above.
4.  **Deploy**: Click "Deploy". Vercel will automatically detect the build settings (`npm run build`).

## 🐳 Docker Deployment

For self-hosted environments or other cloud providers.

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Build & Run
```bash
docker build -t shipex-app .
docker run -p 3000:3000 shipex-app
```

## 🔍 Verification

After deployment:
1.  Visit the production URL.
2.  Check the `/login` page loads.
3.  Verify static assets (logos, fonts) are loading from the CDN/Edge.
4.  Test a WebSocket connection (Real-time notifications).
