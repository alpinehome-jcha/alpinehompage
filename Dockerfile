FROM nginx:alpine

# Copy custom nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy web assets
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
