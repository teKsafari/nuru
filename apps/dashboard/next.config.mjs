// Cross-origin isolation lets the Nuru worker share memory with the page, so the
// lesson editor's Hakiki panel runs programs exactly as learners' browsers do.
// `credentialless` keeps third-party avatars loading.
const isolation = [
	{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
	{ key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
