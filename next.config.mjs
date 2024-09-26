/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      esmExternals: 'loose', // This allows CommonJS modules to be imported
    },
}
export default nextConfig;
