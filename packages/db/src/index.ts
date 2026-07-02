import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

import { getConntectionString } from "./connection";

const connectionString = process.env.DATABASE_URL!;

type DB = ReturnType<typeof neonDrizzle<typeof schema>> | ReturnType<typeof pgDrizzle<typeof schema>>;

const dbSingleton = globalThis as unknown as {
	db: undefined | DB;
};

if (!dbSingleton.db) {
	if (connectionString?.includes("neondb_owner")) {
		dbSingleton.db = neonDrizzle(getConntectionString(), { schema });
	} else {
		dbSingleton.db = pgDrizzle(getConntectionString(), { schema });
	}
}

export * from "./schema";

let db = dbSingleton.db;

export { db };
