/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    URI_WSS: process.env.URI_WSS,
    URI_BACK: process.env.URI_BACK,
    BASIC_AUTH_NAME: process.env.BASIC_AUTH_NAME,
    BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,
    WEBSOCKET_USER: process.env.WEBSOCKET_USER,
    WEBSOCKET_PASSWORD: process.env.WEBSOCKET_PASSWORD,
  }
}

module.exports = nextConfig
