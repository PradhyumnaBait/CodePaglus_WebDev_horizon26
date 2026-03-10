/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Serve report PDFs from public/reports
  async headers() {
    return [
      {
        source: "/reports/:path*",
        headers: [
          {
            key: "Content-Disposition",
            value: "attachment",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
