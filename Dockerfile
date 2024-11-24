# Step 1: Build the app using Node.js
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

# Accept API_ADDRESS as a build argument
ARG API_ADDRESS
ENV VITE_API_ADDRESS=${API_ADDRESS}

COPY . .

RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the custom NGINX config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx will serve on
EXPOSE 80

# Run Nginx in the foreground (prevent daemon mode)
CMD ["nginx", "-g", "daemon off;"]