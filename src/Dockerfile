FROM node:10-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3001 3002
CMD ["npm", "start"]