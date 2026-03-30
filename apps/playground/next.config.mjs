// import { config } from "dotenv";
// config({ path: "../../.env" });

/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	allowedDevOrigins: ["10.0.0.111"],
};
export default nextConfig;
