/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export (out/) for plain PHP/HTML hosting (Hostinger).
  // No Node server: middleware and API routes are unavailable — the lead form
  // posts to /lead.php and language routing is a plain /ua|/en URL prefix.
  output: "export",
  trailingSlash: true, // emit /ua/index.html etc. so Apache serves directories
  reactStrictMode: true,
  images: {
    // The default image optimizer needs a server; static export must inline.
    unoptimized: true,
  },
};

export default nextConfig;
