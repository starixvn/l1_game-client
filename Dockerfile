FROM nginx:1.19-alpine
COPY ./build/web-mobile/ /usr/share/nginx/html
