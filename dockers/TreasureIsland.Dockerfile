FROM registry.nexdev.net:5050/docker/nginx:brotli-1.19
COPY ./.nginx/game.conf /etc/nginx/conf.d/default.conf
COPY ./build/web-mobile/assets/treasure-island /usr/share/nginx/html/treasure-island
COPY ./build/web-mobile/assets/versions.json /usr/share/nginx/html
