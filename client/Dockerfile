FROM node:14 AS builder
RUN mkdir /frontend
WORKDIR /frontend
COPY package.json /frontend/package.json
COPY build.sh /frontend/build.sh
COPY . .
RUN npm install
# Run a seperate build script to also export env variables
RUN /frontend/build.sh

# nginx state for serving content
FROM nginx:stable-alpine
# Copy static assets from builder stage
COPY --from=builder /frontend/build /usr/share/nginx/html
EXPOSE 80
