FROM hub.lumigame.com/base/nginx:1.22-alpine-slim

## Add user permissions
RUN chown -R nginx:nginx /usr/share/nginx && chmod -R 755 /usr/share/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

COPY ./.nginx/game.conf /etc/nginx/conf.d/default.conf
COPY ./build/web-mobile/assets/52 /usr/share/nginx/html/52
COPY ./build/web-mobile/assets/versions.json /usr/share/nginx/html
