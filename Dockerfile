# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install --production

# Copy the rest of your application files to the working directory
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "run", "start:prod"]