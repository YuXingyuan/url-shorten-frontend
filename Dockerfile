FROM nginx:1.27.0-alpine

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY ./build /usr/share/nginx/html

EXPOSE 80
