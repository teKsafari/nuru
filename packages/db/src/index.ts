// import "server-only"

// import { neon } from "@neondatabase/serverless";
// import { Client } from "pg";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle, NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

type DB = ReturnType<typeof neonDrizzle<typeof schema>> | ReturnType<typeof pgDrizzle<typeof schema>>;

const dbSingleton = globalThis as unknown as {
	db: undefined | DB;
};

if (!dbSingleton.db) {
	if (connectionString?.includes("neondb_owner")) {
		console.log("Detected neon conneciton string, connecting to remote neon db");
		dbSingleton.db = neonDrizzle(connectionString, { schema });
	} else {
		const localDBPassword = process.env.DEV_POSTGRES_PASSWORD;
		if (!localDBPassword) {
			throw new Error("Neither neon connection string nor local db config not found. Cannot establish  connection to db. Set either DATABASE_URL or DEV_POSTGRES_PASSWORD");
		}
		console.log("Connecting to local postgres db");
		dbSingleton.db = pgDrizzle(`postgres://postgres:${localDBPassword}@localhost:5432/postgres`, { schema });
	}
}

export * from "./schema";
// export const db = neonDrizzle(connectionString, { schema });

// export const db = pgDrizzle(connectionString, { schema });

let db = dbSingleton.db;

export { db };
