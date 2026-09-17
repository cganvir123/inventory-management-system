# 1. Use the official lightweight Node.js image as the foundation
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only the package files first to leverage Docker caching
COPY package*.json ./

# 4. Install production dependencies
RUN npm install --production

# 5. Copy the rest of your backend source code into the container
COPY . .

# 6. Expose the port the app runs on
EXPOSE 5000

# 7. Define the command to start your application
CMD ["node", "index.js"]