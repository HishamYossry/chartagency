// After `next build`: the standalone server (.next/standalone/server.js) serves public/ and
// .next/static only if they sit next to it, so copy them in. Used by `npm run build`,
// which is what Hostinger runs when it builds the site from source.
import { cpSync, existsSync } from "node:fs";

if (!existsSync(".next/standalone")) {
  console.error("copy-static: .next/standalone is missing — is output: 'standalone' set in next.config.ts?");
  process.exit(1);
}

cpSync("public", ".next/standalone/public", { recursive: true });
cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
console.log("copy-static: public/ and .next/static copied into .next/standalone");
