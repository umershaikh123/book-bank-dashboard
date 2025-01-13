/** @type {import('next').NextConfig} */

const nextConfig = {
  missingSuspenseWithCSRBailout: false,
  async headers() {
    return [
      {
        source: "/api/:path*",

        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ]
  },
}

export default nextConfig
