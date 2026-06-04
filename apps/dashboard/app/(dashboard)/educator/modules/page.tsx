import { Button } from "@nuru/ui/components/button";
import { Card, CardHeader, CardTitle, CardContent } from "@nuru/ui/components/card";
import { cn } from "@nuru/ui/lib/utils";
import Link from "next/link";
import { getEducatorModules, deleteModule } from "@/app/actions/modules";

import { BookOpen, MoreVertical, Plus, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@nuru/ui/components/badge";

export const dynamic = "force-dynamic";

export default async function EducatorLessonsPage() {
	const modules = await getEducatorModules();

	return (
		<div className="space-y-8 pb-12">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">My Modules</h1>
					<p className="text-slate-500 dark:text-slate-400 mt-1">Manage your curriculum and interactive lessons.</p>
				</div>
				<Link href="/educator/modules/create">
					<Button variant="secondary" className="rounded-xl h-11 px-5 font-bold transition-all shadow-sm">
						<Plus className="mr-2 h-4 w-4" />
						Create Module
					</Button>
				</Link>
			</div>
			
			{modules.length === 0 ? (
				<Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
					<div className="bg-primary/10 rounded-2xl p-5 mb-5">
						<BookOpen className="h-10 w-10 text-primary" />
					</div>
					<h3 className="text-xl font-bold text-slate-900 dark:text-white">Your library is empty</h3>
					<p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-6">
						Start building your curriculum by creating your first interactive module.
					</p>
					<Link href="/educator/modules/create">
						<Button size="lg" className="rounded-xl px-8 font-bold">Get Started</Button>
					</Link>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{modules.map((module) => (
						<Card key={module.id} className="group relative overflow-hidden flex flex-col rounded border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
							<CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-row items-center justify-between space-y-0">
								<CardTitle className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate mr-4">
									{typeof module.title === 'string' ? module.title : (module.title as any).en}
								</CardTitle>
								<div className="flex items-center gap-1.5 shrink-0">
									<Badge variant="outline" className="rounded-md px-1.5 py-0 bg-white dark:bg-slate-900 text-[9px] font-bold tracking-widest uppercase border-slate-200 dark:border-slate-700">
										{module.difficulty}
									</Badge>
									<Badge className={cn(
										"rounded-full px-2 py-0 text-[9px] font-bold uppercase tracking-wider",
										module.visibility === 'public' 
											? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" 
											: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
									)}>
										{module.visibility}
									</Badge>
								</div>
							</CardHeader>
							
							<CardContent className="flex-1 p-5 pt-4">
								<div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
									<div className="flex flex-col">
										<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Lessons</span>
										<span className="text-slate-900 dark:text-white font-bold text-base">0</span>
									</div>
									<div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
									<div className="flex flex-col">
										<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Students</span>
										<span className="text-slate-900 dark:text-white font-bold text-base">0</span>
									</div>
								</div>
								
								<div className="flex gap-2 mt-auto">
									<Link href={`/educator/modules/${module.id}`} className="flex-1">
										<Button variant="secondary" className="w-full rounded-lg font-bold h-10 shadow-sm border border-slate-200 dark:border-slate-800">
											Manage
										</Button>
									</Link>
									<form action={deleteModule.bind(null, module.id)}>
										<Button type="submit" variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors">
											<Trash2 className="h-4 w-4" />
										</Button>
									</form>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

