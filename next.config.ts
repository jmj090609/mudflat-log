import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // A GitHub Pages project site is served below /<repository-name>.
  // Local development keeps the familiar root URL.
  basePath: isGitHubPages ? "/mudflat-log" : "",
  assetPrefix: isGitHubPages ? "/mudflat-log/" : "",
};

export default nextConfig;
