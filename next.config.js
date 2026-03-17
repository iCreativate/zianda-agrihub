/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    // In development, Next.js and webpack use eval() for HMR and source maps.
    // Allow it so the app runs; production builds do not need unsafe-eval.
    const scriptSrc = isDev
      ? "'self' 'unsafe-eval' 'unsafe-inline'" // dev: required for Next.js HMR/source maps
      : "'self' 'unsafe-inline'";               // prod: no eval by default

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https: wss:",
              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
