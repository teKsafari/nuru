export default function ProgressLoading() {
	return (
		<main className="flex-1 overflow-auto bg-background p-6 md:p-10">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8">
					<div className="mb-2 h-8 w-56 animate-pulse rounded bg-muted" />
					<div className="h-4 w-72 animate-pulse rounded bg-muted" />
				</div>

				<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
							<div className="mb-3 h-3 w-24 animate-pulse rounded bg-muted" />
							<div className="h-7 w-16 animate-pulse rounded bg-muted" style={{ animationDelay: `${i * 80}ms` }} />
						</div>
					))}
				</div>

				<div className="space-y-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
							<div className="mb-3 flex items-center justify-between">
								<div className="h-4 w-48 animate-pulse rounded bg-muted" />
								<div className="h-4 w-12 animate-pulse rounded bg-muted" />
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
								<div className="h-full w-1/2 animate-pulse rounded-full bg-blue-200" style={{ animationDelay: `${i * 100}ms` }} />
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
