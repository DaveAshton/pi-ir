/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    env: {
        serverUrl: 'http://192.168.1.51:3000',
      },
}

module.exports = nextConfig
