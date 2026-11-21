/** @type {import('next').NextConfig} */
const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/+$/, "") ?? "";

if (isGitHubPagesBuild && !basePath) {
  throw new Error("NEXT_PUBLIC_BASE_PATH is required for the GitHub Pages export.");
}

const nextConfig = {
  distDir: process.env.NEXT_PREVIEW_DIST_DIR ?? '.next',
  ...(isGitHubPagesBuild
    ? { output: "export", basePath, trailingSlash: true }
    : {
        async redirects() {
          return [
            {
              source: "/tienda/camiseta-sendero",
              destination: "/tienda/camiseta-esperanza-de-vida",
              permanent: true,
            },
          ];
        },
      }),
  images: {
    unoptimized: isGitHubPagesBuild,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
