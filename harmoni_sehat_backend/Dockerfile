FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
RUN mkdir -p uploads && chown -R node:node /app
USER node
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8000/health || exit 1
CMD ["node", "dist/index.js"]
