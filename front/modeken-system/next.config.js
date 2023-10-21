/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    URI_WSS: process.env.URI_WSS,
    URI_FRONT: process.env.URI_FRONT,
    URI_BACK: process.env.URI_BACK,
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
  }
}

module.exports = nextConfig
