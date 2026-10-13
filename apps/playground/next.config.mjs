import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Written by scripts/copy-runtime.mjs (predev, prebuild): the runtime's content
// hash and this build's id. See that script for why both exist.
function readStamp() {
	try {
		const dir = path.dirname(fileURLToPath(import.meta.url));
		const v = JSON.parse(fs.readFileSync(path.join(dir, "public/nuru/version.json"), "utf8"));
		if (typeof v.runtime === "string" && typeof v.build === "string") return v;
	} catch {}
	return { runtime: "", build: "" };
}
const stamp = readStamp();

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
	// Inlined into client code: lib/runtime-version.ts and components/tovuti/sw-register.tsx.
	env: {
		NURU_RUNTIME_VERSION: stamp.runtime,
		NURU_BUILD_ID: stamp.build,
	},
	generateBuildId: async () => stamp.build || null,
	async headers() {
		return [
			{ source: "/:path*", headers: isolation },
			{
				source: "/nuru/:file*",
				headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=604800" }],
			},
			{
				// Versioned runtime URLs (?v=<content hash>) never change content.
				source: "/nuru/:file*",
				has: [{ type: "query", key: "v" }],
				headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
			},
			{
				// The service worker must always be revalidated so a deploy reaches learners.
				source: "/sw.js",
				headers: [{ key: "Cache-Control", value: "no-cache" }],
			},
		];
	},
};

export default withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
})(nextConfig);
