/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "loremflickr.com",
      "storage.googleapis.com",
    ],
  },
};

export default nextConfig;
