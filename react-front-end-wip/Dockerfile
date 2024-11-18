# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./Geo_app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./Geo_app/ ./

# Build the application
RUN npm run build

# Expose the port Vite runs on
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
