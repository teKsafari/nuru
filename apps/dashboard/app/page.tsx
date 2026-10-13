import Link from "next/link";
import { ArrowRight, BookOpen, LineChart, School } from "lucide-react";
import { getAuth } from "@/lib/auth.server";
import { getServerDict } from "@/lib/lang";
import { Button } from "@nuru/ui/components/button";
import { AppLogo } from "@nuru/ui/components/app-logo";
import { signInAction } from "@/app/actions/auth";
import { LangToggle, ThemeToggle } from "@/components/layout/toggles";

export const dynamic = "force-dynamic";

// The teachers' welcome. Signed-in teachers see it too: it is the map of the room.
export default async function Home() {
	const [{ isAuthenticated, claims }, { t }] = await Promise.all([getAuth(), getServerDict()]);
	const roles = (claims?.roles as string[] | undefined) ?? [];
	const isEducator = isAuthenticated && (roles.includes("Educator") || roles.includes("Super Admin"));
	const firstName = (claims?.name as string | undefined)?.split(" ")[0];

	const steps = [
		{ n: "01", icon: School, title: t.home.step1, body: t.home.step1Body, href: "/educator/madarasa", fill: "bg-jua text-[#15120f]" },
		{ n: "02", icon: BookOpen, title: t.home.step2, body: t.home.step2Body, href: "/educator/modules", fill: "bg-bahari text-white" },
		{ n: "03", icon: LineChart, title: t.home.step3, body: t.home.step3Body, href: "/educator/madarasa", fill: "bg-mwani text-white" },
	];

	return (
		<div className="flex min-h-dvh flex-col bg-karatasi">
			<div className="pindo text-jua" aria-hidden />
			<header className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4 sm:px-8">
				<Link href="/" className="mr-auto flex items-center gap-2.5">
					<AppLogo size={36} />
					<span className="flex flex-col leading-none">
						<span className="font-display text-2xl font-extrabold">Nuru</span>
						<span className="lebo mt-0.5 text-muted-foreground">Chumba cha Walimu</span>
					</span>
				</Link>
				<LangToggle />
				<ThemeToggle />
			</header>

			<main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-8">
				<section className="grid items-center gap-10 py-8 sm:py-14 lg:grid-cols-[1.15fr_1fr]">
					<div>
						<p className="lebo mb-4 inline-block rounded-sm border-2 border-mstari bg-card px-2 py-1">{t.app.tagline}</p>
						<h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl">
							{t.home.helloWord}, <span className="alama-jua">{firstName && isEducator ? firstName : t.home.helloName}</span>
						</h1>
						<p className="mt-5 max-w-xl text-lg text-muted-foreground">{t.home.lead}</p>
						<div className="mt-8 flex flex-wrap items-center gap-3">
							{isEducator ? (
								<Button asChild size="lg">
									<Link href="/educator/modules">
										{t.home.enterSignedIn}
										<ArrowRight />
									</Link>
								</Button>
							) : (
								<form action={signInAction}>
									<Button type="submit" size="lg">
										{t.home.enter}
										<ArrowRight />
									</Button>
								</form>
							)}
							<Button asChild variant="link">
								<a href="https://nuruprogramming.org" target="_blank" rel="noopener">
									{t.home.website}
								</a>
							</Button>
						</div>
					</div>

					{/* A little classroom board: the progress grid a teacher will see */}
					<div className="mji relative hidden overflow-hidden sm:block" aria-hidden>
						<div className="flex items-center justify-between border-b-2 border-mstari bg-karatasi-2 px-4 py-2">
							<span className="lebo">Darasa la 5B · NURU-7K2Q</span>
							<span className="lebo text-muted-foreground">12 / 14</span>
						</div>
						<div className="gridi space-y-2 p-4">
							{["Asha", "Baraka", "Neema", "Juma", "Zawadi"].map((name, r) => (
								<div key={name} className="flex items-center gap-3">
									<span className="w-16 truncate text-sm font-semibold">{name}</span>
									<div className="flex flex-1 gap-1.5">
										{Array.from({ length: 8 }).map((_, c) => {
											const done = c < 7 - r - (r % 2);
											const stuck = c === 7 - r - (r % 2);
											return <span key={c} className={`h-6 flex-1 rounded-sm border-2 border-mstari ${done ? "bg-mwani" : stuck ? "bg-chungwa" : "bg-card"}`} />;
										})}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section aria-labelledby="three">
					<h2 id="three" className="mb-5 font-display text-2xl font-bold">
						{t.home.threeTitle}
					</h2>
					<ol className="grid gap-5 md:grid-cols-3">
						{steps.map((s) => {
							const body = (
								<>
									<div className="flex items-center justify-between">
										<span className={`flex size-12 items-center justify-center rounded-md border-2 border-mstari ${s.fill}`}>
											<s.icon className="size-6" />
										</span>
										<span className="font-display text-4xl font-extrabold text-foreground/15">{s.n}</span>
									</div>
									<h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
									<p className="mt-2 text-muted-foreground">{s.body}</p>
								</>
							);
							return (
								<li key={s.n}>
									{isEducator ? (
										<Link href={s.href} className="mji bonyeza block h-full p-5">
											{body}
										</Link>
									) : (
										<div className="mji h-full p-5">{body}</div>
									)}
								</li>
							);
						})}
					</ol>
				</section>
			</main>

			<footer className="border-t-2 border-mstari">
				<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-4 py-4 text-sm text-muted-foreground sm:px-8">
					<p className="lebo">teKsafari · Nuru</p>
				</div>
				<div className="pindo-nukta mb-2 text-udongo" aria-hidden />
			</footer>
		</div>
	);
}
