# Multi-stage Dockerfile for MCP Playwright Test Runner
# Production-ready with pre-installed browsers and optimized layers

# Stage 1: Base image with Node.js and dependencies
FROM node:18-bookworm AS base

# Install system dependencies required for Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    wget \
    fonts-liberation \
    fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Stage 2: Dependencies installation
FROM base AS dependencies

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 3: Development dependencies and Playwright browsers
FROM dependencies AS playwright-install

# Install dev dependencies for building
COPY package.json package-lock.json ./
RUN npm ci

# Install Playwright browsers
RUN npx playwright install chromium firefox webkit

# Stage 4: Build TypeScript
FROM playwright-install AS builder

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Stage 5: Production image
FROM base AS production

# Set environment variables
ENV NODE_ENV=production \
    ARTIFACTS_DIR=/data/test-results \
    MAX_CONCURRENT_RUNS=3 \
    MAX_TEST_DURATION=300000 \
    BROWSER_TIMEOUT=30000

# Create non-root user for security
RUN groupadd -r mcp && useradd -r -g mcp -G audio,video mcp && \
    mkdir -p /data/test-results && \
    chown -R mcp:mcp /data

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy Playwright browsers from playwright-install stage
COPY --from=playwright-install /root/.cache/ms-playwright /home/mcp/.cache/ms-playwright

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Fix permissions for Playwright cache
RUN chown -R mcp:mcp /home/mcp/.cache

# Switch to non-root user
USER mcp

# Create volume for test results
VOLUME ["/data/test-results"]

# Health check to ensure MCP server is responsive
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "process.exit(0)" || exit 1

# Expose stdio for MCP communication (no network ports needed)
# MCP communicates via stdin/stdout

# Start the MCP server
CMD ["node", "dist/index.js"]
