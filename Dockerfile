# 1. Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies with cache optimization
COPY package*.json ./
RUN npm ci

# Copy source and build Next.js
COPY . .

RUN npm run build

# 2. Production stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001 -G nodejs

# Copy only standalone output (super small image)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permission
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Run Next.js in standalone mode
CMD ["node", "server.js"]
