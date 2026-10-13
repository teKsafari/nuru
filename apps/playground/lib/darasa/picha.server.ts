import "server-only";

import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

// Picture passwords are an ordered sequence of three picture ids. We store
// "salt:hash" (hex), scrypt over the joined sequence.

export async function hashPicha(sequence: string[]) {
	const salt = randomBytes(16);
	const hash = await scrypt(sequence.join("|"), salt, 32);
	return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPicha(sequence: string[], stored: string) {
	const [saltHex, hashHex] = stored.split(":");
	if (!saltHex || !hashHex) return false;
	const expected = Buffer.from(hashHex, "hex");
	const got = await scrypt(sequence.join("|"), Buffer.from(saltHex, "hex"), expected.length);
	return timingSafeEqual(expected, got);
}

/** Wrong attempts allowed before a lock, and how long the lock lasts. */
export const MAX_ATTEMPTS = 5;
export const LOCK_MS = 60_000;
