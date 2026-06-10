import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import { redirect } from "next/navigation";
import { Button } from "@nuru/ui/components/button";
import { Card, CardHeader, CardTitle, CardContent } from "@nuru/ui/components/card";
import { AppLogo } from "@nuru/ui/components/app-logo";
import { signInAction } from "@/app/actions/auth";
import { ArrowRight, BookOpen, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
	const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

	if (isAuthenticated && claims) {
		const roles = (claims.roles as string[]) || [];
		
		if (roles.includes("Educator") || roles.includes("Super Admin")) {
			redirect("/educator/modules");
		}
	}

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 overflow-hidden bg-slate-50 dark:bg-slate-950">
			{/* Decorative background elements */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

			<div className="z-10 flex flex-col items-center space-y-8 w-full max-w-md">
				<div className="flex flex-col items-center space-y-4 text-center mb-4">
					<div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
						<AppLogo size={56} className="text-primary" />
					</div>
					<h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
						Nuru <span className="text-primary">Educator</span>
					</h1>
					<p className="text-lg text-slate-600 dark:text-slate-400 max-w-sm">
						The ultimate platform to build, manage, and share interactive programming curricula.
					</p>
				</div>

				<Card className="w-full shadow-2xl border-0 ring-1 ring-slate-200/50 dark:ring-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
					<CardContent className="p-8 flex flex-col gap-8">
						<div className="space-y-4">
							<div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
								<div className="bg-primary/10 p-3 rounded-xl">
									<Layers className="h-6 w-6 text-primary" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-900 dark:text-slate-100">Rich Modules</h3>
									<p className="text-sm text-slate-500">Create comprehensive courses</p>
								</div>
							</div>
							
							<div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
								<div className="bg-blue-500/10 p-3 rounded-xl">
									<BookOpen className="h-6 w-6 text-blue-500" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-900 dark:text-slate-100">Interactive Lessons</h3>
									<p className="text-sm text-slate-500">Engage students with live code</p>
								</div>
							</div>
						</div>

						<form action={signInAction} className="w-full">
							<Button size="lg" className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group">
								Access Dashboard
								<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
							</Button>
						</form>
					</CardContent>
				</Card>

				<div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
					<a href="https://nuruprogramming.org" className="hover:text-primary transition-colors">Website</a>
					<div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
					<a href="https://nuruprogramming.org/docs" className="hover:text-primary transition-colors">Documentation</a>
				</div>
			</div>
		</main>
	);
}
