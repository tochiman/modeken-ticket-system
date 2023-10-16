FROM nginx:1.25.2

WORKDIR /etc/nginx/ssl

RUN openssl genrsa 2048 > server.key
RUN echo -e "\n\n\n\n\n\n\n\n\n" | openssl req -new -key server.key > server.csr
RUN openssl x509 -days 365 -req -signkey server.key < server.csr > server.crt