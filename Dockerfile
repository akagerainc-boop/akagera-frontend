# Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /app/build ./build

# Expose port
EXPOSE 3000

# Run application. No -s flag: build/serve.json holds the SPA fallback, and
# -s would put its catch-all ahead of the /privacy-policy static page.
CMD ["serve", "build", "-l", "3000"]
