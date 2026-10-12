import withBundleAnalyzer from "@next/bundle-analyzer";

// Cross-origin isolation lets the Nuru worker share memory with the page, which
// is how jaza() pauses a running program to wait for the learner's answer.
// `credentialless` keeps third-party images (GitHub avatars) and analytics working.
const isolation = [
	{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
	{ key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true,
	},
	allowedDevOrigins: ["10.0.0.111"],
	async headers() {
		return [
			{ source: "/:path*", headers: isolation },
			{
				source: "/nuru/:file*",
				headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=604800" }],
			},
		];
	},
};

export default withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
})(nextConfig);
