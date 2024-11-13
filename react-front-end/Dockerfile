# Dockerfile for React frontend
# Use the official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the React development server
CMD ["npm", "run", "dev"]
