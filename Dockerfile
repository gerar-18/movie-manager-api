###################
# BUILD
###################

FROM node:20 AS builder

WORKDIR /app

COPY package.json ./
RUN npm install 

COPY . .
RUN npm run build

###################
# PRODUCTION
###################

FROM node:20 AS compact-build

WORKDIR /app

COPY package.json ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/typeorm.config.ts ./ 

EXPOSE 8080

# CMD ["sh", "-c", "npm run migration:run && node dist/main.js"]
CMD ["node", "dist/main.js"]