/**
 * Shared 3-column playground loading skeleton (sidebar / lesson content /
 * editor + output). Used by route-level `loading.tsx` files that still need a
 * suspense fallback. The anza lesson route intentionally does NOT use this: its
 * shell lives in a persistent layout, so navigation no longer suspends.
 */
export function PlaygroundSkeleton() {
	return (
		<div className="h-full w-full bg-background p-3">
			<div className="grid h-full grid-cols-1 gap-3 md:grid-cols-[20%_38%_42%]">
				{/* Sidebar skeleton */}
				<div className="hidden h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:flex">
					<div className="border-b border-border px-5 pt-5 pb-4">
						<div className="flex items-center gap-2.5">
							<div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
							<div className="h-4 w-24 animate-pulse rounded bg-muted" />
						</div>
						<div className="mt-4 h-1.5 w-full animate-pulse rounded-full bg-muted" />
					</div>
					<div className="space-y-2 p-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2">
								<div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
								<div className="h-3 flex-1 animate-pulse rounded bg-muted" style={{ animationDelay: `${i * 80}ms` }} />
							</div>
						))}
					</div>
				</div>

				{/* Lesson content skeleton */}
				<div className="hidden h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm md:flex">
					<div className="mb-6 h-3 w-40 animate-pulse rounded bg-muted" />
					<div className="mb-4 h-8 w-3/4 animate-pulse rounded bg-muted" />
					<div className="mb-2 h-3 w-24 animate-pulse rounded bg-muted" />
					<div className="mt-6 space-y-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className="h-3 animate-pulse rounded bg-muted"
								style={{ width: `${90 - i * 8}%`, animationDelay: `${i * 100}ms` }}
							/>
						))}
					</div>
					<div className="mt-8 h-32 w-full animate-pulse rounded-xl bg-muted" />
				</div>

				{/* Editor + output skeleton */}
				<div className="flex h-full flex-col gap-3">
					<div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
						<div className="flex items-center justify-between border-b border-border px-4 py-3">
							<div className="h-4 w-20 animate-pulse rounded bg-muted" />
							<div className="flex gap-2">
								<div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
								<div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
							</div>
						</div>
						<div className="space-y-2 p-4">
							{Array.from({ length: 10 }).map((_, i) => (
								<div
									key={i}
									className="h-3 animate-pulse rounded bg-muted"
									style={{ width: `${40 + ((i * 13) % 50)}%`, animationDelay: `${i * 80}ms` }}
								/>
							))}
						</div>
					</div>
					<div className="h-40 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
						<div className="border-b border-border px-4 py-2">
							<div className="h-4 w-16 animate-pulse rounded bg-muted" />
						</div>
						<div className="m-3 h-24 animate-pulse rounded-xl bg-muted" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default PlaygroundSkeleton;
