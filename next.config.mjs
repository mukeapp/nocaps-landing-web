/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Habit-stack banners, post images, avatars and carousel slides are
    // arbitrary https URLs stored in backend data (mobile's RN Image has no
    // allowlist), so enumerate-per-host kept breaking at runtime. Re-tighten
    // to an explicit list before production hardening if desired.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
