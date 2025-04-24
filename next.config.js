/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Configure image optimization
  images: {
    domains: [], // Add your image domains here
    formats: ['image/avif', 'image/webp'],
  },
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  
  // Configure webpack for better performance
  webpack: (config, { isServer }) => {
    // Add custom webpack configuration here if needed
    return config
  },
  
  // Configure environment variables
  env: {
    // Add your environment variables here
  },
  
  // Configure build output
  distDir: '.next',
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Configure compiler options
  compiler: {
    // Enable styled-components support
    styledComponents: true,
  },
}

module.exports = nextConfig 