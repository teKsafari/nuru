export default function MasomoLoading() {
	return (
		<main className="flex-1 overflow-auto bg-background p-6 md:p-10">
			<div className="mx-auto max-w-6xl">
				<header className="mb-10 text-center">
					<div className="mx-auto mb-3 h-8 w-64 animate-pulse rounded bg-muted" />
					<div className="mx-auto h-4 w-80 animate-pulse rounded bg-muted" />
				</header>

				<div className="space-y-10">
					{Array.from({ length: 3 }).map((_, m) => (
						<div key={m} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
							<div className="mb-6 flex items-center gap-3">
								<div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
								<div className="h-5 w-48 animate-pulse rounded bg-muted" />
							</div>
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
								{Array.from({ length: 6 }).map((_, i) => (
									<div
										key={i}
										className="h-16 animate-pulse rounded-xl bg-muted"
										style={{ animationDelay: `${(m * 6 + i) * 60}ms` }}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
