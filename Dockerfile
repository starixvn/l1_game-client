FROM registry.nexdev.net:5050/docker/nginx:brotli-1.20.2
COPY ./.nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./build/web-mobile/ /usr/share/nginx/html