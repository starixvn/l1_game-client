FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib as builder

COPY ./build/web-mobile/ /app
RUN rm -rf /app/assets
COPY ./build/web-mobile/assets/main /assets/main
COPY ./build/web-mobile/assets/resources /assets/resources
COPY ./build/web-mobile/assets/internal /assets/internal
COPY ./build/web-mobile/assets/versions.json /assets/versions.json


FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib as publish
## Add user permissions
RUN chown -R nginx:nginx /usr/share/nginx && chmod -R 755 /usr/share/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

COPY ./.nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app /usr/share/nginx/html/
COPY --from=builder /assets /usr/share/nginx/html/assets