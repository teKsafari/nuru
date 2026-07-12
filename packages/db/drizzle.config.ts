import "dotenv/config"

import { defineConfig } from "drizzle-kit";

import { getConntectionString } from "./src/connection";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: getConntectionString(),
	},
});
