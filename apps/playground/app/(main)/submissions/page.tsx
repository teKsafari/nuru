"use client";

// Mock submissions data
const mockSubmissions = [
	{
		id: 1,
		title: "Hello World - Nuru",
		language: "Nuru",
		status: "accepted",
		date: "2025-01-15",
		code: 'andika("Habari Dunia!")',
	},
	{
		id: 2,
		title: "Fibonacci Sequence",
		language: "Nuru",
		status: "accepted",
		date: "2025-01-14",
		code: "fanya fib = unda(n) {\n  kama (n <= 1) { rudisha n }\n  rudisha fib(n-1) + fib(n-2)\n}",
	},
	{
		id: 3,
		title: "LED Blink Pattern",
		language: "Nuru",
		status: "wrong_answer",
		date: "2025-01-13",
		code: '// LED blink attempt\nandika("blink")',
	},
	{
		id: 4,
		title: "Sorting Algorithm",
		language: "Nuru",
		status: "accepted",
		date: "2025-01-12",
		code: "fanya panga = unda(orodha) {\n  // bubble sort\n}",
	},
];

function StatusBadge({ status }: { status: string }) {
	const styles: Record<string, string> = {
		accepted: "bg-green-500/20 text-green-400 border-green-500/30",
		wrong_answer: "bg-red-500/20 text-red-400 border-red-500/30",
		pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
	};

	const labels: Record<string, string> = {
		accepted: "Accepted",
		wrong_answer: "Wrong Answer",
		pending: "Pending",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.pending}`}
		>
			{labels[status] ?? status}
		</span>
	);
}

function SubmissionsDashboard({ userName }: { userName: string }) {
	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Submissions</h1>
					<p className="text-sm text-muted-foreground">
						Welcome back, <span className="text-yellow-500">{userName}</span>
					</p>
				</div>
				<button
					// onClick={() => signOut()}
					className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-red-500/50 hover:text-red-400"
				>
					Sign Out
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4">
				{[
					{ label: "Total", value: mockSubmissions.length },
					{
						label: "Accepted",
						value: mockSubmissions.filter((s) => s.status === "accepted")
							.length,
					},
					{
						label: "Failed",
						value: mockSubmissions.filter((s) => s.status === "wrong_answer")
							.length,
					},
				].map((stat) => (
					<div
						key={stat.label}
						className="rounded-xl border border-border/50 bg-card p-4 text-center"
					>
						<p className="text-2xl font-bold text-foreground">{stat.value}</p>
						<p className="text-xs text-muted-foreground">{stat.label}</p>
					</div>
				))}
			</div>

			{/* Submissions Table */}
			<div className="overflow-hidden rounded-xl border border-border/50">
				<table className="w-full text-left text-sm">
					<thead className="border-b border-border/50 bg-muted/30">
						<tr>
							<th className="px-4 py-3 font-medium text-muted-foreground">
								Title
							</th>
							<th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
								Language
							</th>
							<th className="px-4 py-3 font-medium text-muted-foreground">
								Status
							</th>
							<th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
								Date
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border/30">
						{mockSubmissions.map((sub) => (
							<tr key={sub.id} className="transition-colors hover:bg-muted/20">
								<td className="px-4 py-3 font-medium text-foreground">
									{sub.title}
								</td>
								<td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
									{sub.language}
								</td>
								<td className="px-4 py-3">
									<StatusBadge status={sub.status} />
								</td>
								<td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
									{sub.date}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default function SubmissionsPage() {
	return <SubmissionsDashboard userName={"session.user.name"} />;
}
