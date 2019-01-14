FROM nginx
# COPY frontend/ /usr/share/nginx/html/vue
COPY config/ /etc/nginx/conf.d/
COPY ssl/ /root/ssl/

EXPOSE 80
EXPOSE 443

# RUN chown nginx.nginx /usr/share/nginx/html/vue -R
CMD ["nginx", "-g", "daemon off;"]