# Dockerfile for React frontend

# Step 1: Use node image to build the app
FROM node:18 as build

WORKDIR /app

COPY package.json ./ 
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Step 2: Use a simple HTTP server to serve the built app
FROM node:18-slim
WORKDIR /app

COPY --from=build /app/build /app/build
RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "5000"]

EXPOSE 5000
