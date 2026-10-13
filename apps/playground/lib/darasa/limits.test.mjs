import { test } from "node:test";
import assert from "node:assert/strict";

import { TokenBuckets, lockDurationMs, LOCK_LEVEL_TEACHER, clientIp } from "./limits.ts";

test("lock escalates 1m, 5m, 30m, then teacher", () => {
	assert.equal(lockDurationMs(1), 60_000);
	assert.equal(lockDurationMs(2), 300_000);
	assert.equal(lockDurationMs(3), 1_800_000);
	assert.equal(lockDurationMs(LOCK_LEVEL_TEACHER), null);
	assert.equal(LOCK_LEVEL_TEACHER, 4);
});

test("bucket allows capacity then asks to wait, and refills", () => {
	const b = new TokenBuckets(3, 0.5);
	const t = 1_000_000;
	assert.equal(b.take("a", t), 0);
	assert.equal(b.take("a", t), 0);
	assert.equal(b.take("a", t), 0);
	assert.equal(b.take("a", t), 2);
	assert.equal(b.take("b", t), 0, "keys are independent");
	assert.equal(b.take("a", t + 2000), 0, "one token back after 2s");
	assert.ok(b.take("a", t + 2000) > 0);
});

test("bucket map stays bounded", () => {
	const b = new TokenBuckets(2, 1, 100);
	for (let i = 0; i < 1000; i++) b.take(`k${i}`, 0);
	assert.ok(b["buckets"].size <= 100);
});

test("clientIp takes the first forwarded address", () => {
	assert.equal(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" })), "1.2.3.4");
	assert.equal(clientIp(new Headers({ "x-real-ip": "5.6.7.8" })), "5.6.7.8");
	assert.equal(clientIp(new Headers()), "unknown");
});
