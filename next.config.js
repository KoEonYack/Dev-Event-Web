const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['brave-people-3.s3.ap-northeast-2.amazonaws.com'],
  },
  env: {
    BASE_SERVER_URL: process.env.BASE_SERVER_URL,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
    NAVER_SITE_VERIFICATION: process.env.NAVER_SITE_VERIFICATION,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
