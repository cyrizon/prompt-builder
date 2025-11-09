# Alternative Dockerfile without Nginx - uses Node.js serve
# Use this if you already have Nginx running

FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Install serve globally to serve static files
RUN npm install -g serve

# Copy static build
COPY --from=builder /app/build ./build

# Expose custom port
EXPOSE 3001

# Serve static files
CMD ["serve", "-s", "build", "-l", "3001"]
