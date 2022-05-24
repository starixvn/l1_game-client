FROM registry.nexdev.net:5050/docker/nginx:brotli-1.19
COPY ./build/web-mobile/ /usr/share/nginx/html