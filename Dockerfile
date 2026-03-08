# Stage 1: Install dependencies
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Build the application
FROM node:lts-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_OPENCAGE_API_KEY
ENV NEXT_PUBLIC_OPENCAGE_API_KEY=$NEXT_PUBLIC_OPENCAGE_API_KEY
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Stage 3: Run the application
FROM node:lts-alpine AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next/ ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 7777
ENV PORT 7777

CMD HOSTNAME='0.0.0.0' npm start
