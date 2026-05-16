import { Button, Card, CardHeader, CardTitle, CardContent } from "@nuru/ui";
import Link from "next/link";
import { getEducatorModules } from "@/app/actions/modules";

export const dynamic = "force-dynamic";

export default async function EducatorLessonsPage() {
	const modules = await getEducatorModules();

	return (
		<div className="container mx-auto py-10 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">My Modules</h1>
					<p className="text-muted-foreground">Manage your curriculum and interactive lessons.</p>
				</div>
				<Link href="/educator/lessons/create">
					<Button>Create New Module</Button>
				</Link>
			</div>
			
			{modules.length === 0 ? (
				<Card className="flex flex-col items-center justify-center p-12 text-center">
					<div className="bg-muted rounded-full p-4 mb-4">
						<BookOpen className="h-8 w-8 text-muted-foreground" />
					</div>
					<h3 className="text-xl font-semibold">No modules yet</h3>
					<p className="text-muted-foreground max-w-sm mt-2 mb-6">
						Create your first module to start building interactive lessons for your students.
					</p>
					<Link href="/educator/lessons/create">
						<Button>Get Started</Button>
					</Link>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{modules.map((module) => (
						<Card key={module.id} className="overflow-hidden flex flex-col">
							<CardHeader className="pb-3">
								<div className="flex justify-between items-start">
									<CardTitle className="text-lg">
										{typeof module.title === 'string' ? module.title : (module.title as any).en}
									</CardTitle>
									<Badge variant={module.visibility === 'public' ? 'secondary' : 'outline'}>
										{module.visibility}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="flex-1">
								<div className="flex flex-col gap-1 text-sm text-muted-foreground mb-4">
									<span className="flex items-center gap-1 capitalize">
										<Badge variant="outline" className="p-0 h-auto font-normal">
											{module.difficulty}
										</Badge>
									</span>
								</div>
								<div className="flex gap-2 mt-auto pt-4 border-t">
									<Link href={`/educator/lessons/edit/${module.id}`} className="flex-1">
										<Button variant="outline" size="sm" className="w-full">Edit</Button>
									</Link>
									<Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

import { BookOpen } from "lucide-react";
import { Badge } from "@nuru/ui";
