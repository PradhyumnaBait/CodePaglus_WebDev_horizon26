/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Allow large API responses (PDF generation)
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
    responseLimit: "8mb",
  },

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
