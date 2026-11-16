import path from "node:path";
import type { NextConfig } from "next";

// Runs as a Node app on Hostinger. `npm run build` produces .next/standalone/server.js
// (started by `npm start`) — see DEPLOY.md. Content comes from the admin API (CMS_API_URL).

// Pin the project root: without it Next.js may pick up a package-lock.json in a parent
// folder on the server, treat it as a monorepo and nest server.js one level deeper.
const root = path.resolve(__dirname);

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: root,
  turbopack: { root },
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
