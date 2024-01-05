module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://26.158.223.36:3001/api/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'http://26.158.223.36:3001/static/:path*',
      },
    ]
  },
}
