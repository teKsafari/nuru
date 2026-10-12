// import "server-only"

import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL!;

// Neon's HTTP driver only speaks to Neon. Any other Postgres (local docker, CI) goes through postgres-js.
function createDb() {
	if (/neon\.tech/.test(url ?? "")) {
		return drizzleNeon(neon(url), { schema });
	}
	const g = globalThis as unknown as { __nuruPg?: ReturnType<typeof postgres> };
	g.__nuruPg ??= postgres(url, { max: 5 });
	return drizzlePg(g.__nuruPg, { schema }) as unknown as ReturnType<typeof drizzleNeon<typeof schema>>;
}

export * from "./schema";
export const db = createDb();
