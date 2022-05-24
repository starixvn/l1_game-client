FROM registry.nexdev.net:5050/docker/nginx:brotli-1.19
COPY ./.nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./build/web-mobile/ /usr/share/nginx/html