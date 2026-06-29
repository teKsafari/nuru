export default function LandingLoading() {
	return (
		<main className="relative overflow-x-hidden bg-white">
			<section className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-20">
				<div className="mb-3 h-12 w-32 animate-pulse rounded-lg bg-yellow-100" />
				<div className="mb-4 h-10 w-3/4 animate-pulse rounded bg-slate-100 md:h-12" />
				<div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
				<div className="mb-8 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
				<div className="flex gap-3">
					<div className="h-11 w-32 animate-pulse rounded-md bg-slate-200" />
					<div className="h-11 w-32 animate-pulse rounded-md bg-slate-100" />
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
						>
							<div className="mb-4 h-10 w-10 animate-pulse rounded-lg bg-slate-100" />
							<div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
							<div className="h-3 w-full animate-pulse rounded bg-slate-100" style={{ animationDelay: `${i * 80}ms` }} />
							<div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-slate-100" />
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
