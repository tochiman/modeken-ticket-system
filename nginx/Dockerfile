# FROM nginx:1.25.2 as Build

# ARG BASIC_AUTH_USER
# ARG BASIC_AUTH_PASSWORD

# RUN crypt_pass=`openssl passwd -apr1 ${BASIC_AUTH_PASSWORD}` && \
# echo "${BASIC_AUTH_USER}:${crypt_pass}" > .htpasswd

FROM nginx:1.25.2

WORKDIR /etc/nginx/ssl

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=Build .htpasswd /etc/nginx/.htpasswd

RUN openssl genrsa 2048 > server.key
RUN echo -e "\n\n\n\n\n\n\n\n\n" | openssl req -new -key server.key > server.csr
RUN openssl x509 -days 365 -req -signkey server.key < server.csr > server.crt