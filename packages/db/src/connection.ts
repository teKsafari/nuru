export function getConntectionString(): string {
	const connectionString = process.env.DATABASE_URL!;

	const isNeon = connectionString?.includes("neondb_owner");

	if (isNeon) {
		console.log("Detected neon conneciton string, connecting to remote neon db");
		return connectionString;
	} else {
		const localDBPassword = process.env.DEV_POSTGRES_PASSWORD;
		if (!localDBPassword) {
			throw new Error("Neither neon connection string nor local db config not found. Cannot establish  connection to db. Set either DATABASE_URL or DEV_POSTGRES_PASSWORD");
		}
		console.log("Connecting to local postgres db");
		return `postgres://postgres:${localDBPassword}@localhost:5432/postgres`;
	}
}