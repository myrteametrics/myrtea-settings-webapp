# FROM nginx:alpine
FROM nginxinc/nginx-unprivileged:1.17-alpine

# Cannot use rm in this folder without root privilege
# RUN rm -rf /usr/share/nginx/html/*
COPY dist/myrtea-interface /usr/share/nginx/html

USER nginx

CMD ["nginx", "-g", "daemon off;"]
