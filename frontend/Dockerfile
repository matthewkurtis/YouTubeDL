# Stage 1: Build the React application
FROM node:21 AS build
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .
# RUN npm run build


# # Stage 2: Serve the application with Nginx
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# # Copy the Nginx configuration for the React app (if you have one)
# # COPY ./nginx/react.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

EXPOSE 3000
CMD ["npm", "start"]