import withBundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true,
	},
	allowedDevOrigins: ["10.0.0.111"],
};
export default withBundleAnalyzer({
	enabled:process.env.ANALYZE === 'true',
})(nextConfig);
