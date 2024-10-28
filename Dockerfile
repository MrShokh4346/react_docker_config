# Use an official node image as the base image
FROM node:16 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies with increased timeout
RUN npm install --legacy-peer-deps --timeout=60000
RUN npm install react-scripts --force

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy the rest of the application code
COPY . .
RUN npm run build

# Step 2: Use NGINX image to serve the static files
FROM nginx:alpine
# Copy NGINX configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files to NGINX default location
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

