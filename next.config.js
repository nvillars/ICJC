/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  images: {
    // allow external image hosts used by Facebook/embeds; keep minimal and explicit
    domains: ['scontent.xx.fbcdn.net', 'static.xx.fbcdn.net', 'platform-lookaside.fbsbx.com'],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    // allow 'unsafe-eval' only in non-production (dev) to support webpack HMR/dev tooling
    const scriptSrc = isProd ? "'self' 'unsafe-inline' https:" : "'self' 'unsafe-inline' 'unsafe-eval' https:"
    const csp = `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; connect-src 'self' https:; frame-src 'self' https://www.facebook.com https://www.youtube.com;`
    return [
      {
        // apply these headers to all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
          // Content Security Policy (adjusted per env)
          { key: 'Content-Security-Policy', value: csp }
        ]
      }
    ]
  }
}

module.exports = nextConfig
