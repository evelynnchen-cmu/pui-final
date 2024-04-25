/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'visage.surgeplay.com',
        port: '',
        pathname: '/**/128/**',
      },
    ],
  },
};

export default nextConfig;
