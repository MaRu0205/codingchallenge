# Step 1: Build the application
FROM node:latest as build-step
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the application from Nginx
FROM nginx:alpine
COPY --from=build-step /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf  # Only if you have a custom Nginx configuration
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

